"use strict";

import { default as Express } from 'express';
import * as HTTP from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import Database from 'better-sqlite3';
import { authRouter, usersRouter, gameRouter } from './routers/index.js';
import { errorHandler, notFound } from './middleware/index.js';
import { getShips, getMessages, getMessage, insertMessage } from './models/gameData.js';
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bodyParser from "body-parser";
import { InMemoryGameStore } from './stores/game.js';


/*
 * === SETUP ===
 */

const app = Express();
app.use(cors());
app.use(bodyParser.json());
app.use(Express.json());

const httpServer = HTTP.createServer(app); // feed in 'app' to use socket with express

passport.use(
	new JwtStrategy({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.JWT_SECRET,
	}, (payload, done) => {
		return done(null, payload.data);
	}),
);

// fs.unlinkSync('sqlite3.db'); // uncomment to reset to clean db
const db = new Database(process.env.DB || 'sqlite3.db', {
	// verbose: console.log
});
db.exec(fs.readFileSync('schema.sql').toString());
export default db;

const gameStore = new InMemoryGameStore(); // during runtime, keeps track of games between player sockets


/*
 * === API ===
 */

// Reset to 'schema.sql'. Testing only.
if (process.env.ALLOW_RESET_DATABASE) {
	app.put('/reset_database', (req, res) => {
		db.prepare('PRAGMA foreign_keys = OFF').run();
		for (let row of db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name != 'sqlite_sequence'").all()) {
			db.prepare(`drop table "${row['name']}"`).run();
		}

		db.exec(fs.readFileSync('schema.sql').toString());
		db.prepare('PRAGMA foreign_keys = ON').run();

		res.json({});
	});
}
// Leave a route for '/' returning status code 200 in place, as it is used by the 'npm test' script
// to detect that the server is up and running.
app.get('/', (req, res) => res.json({ success: true }));
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/game', gameRouter);
app.use(errorHandler);
app.use(notFound);


/*
 * === SOCKET ===
 */

const io = new Server(httpServer, {
	cors: {
		// Allow localhost requests to reach server
		origin: 'http://localhost:5173',
	},
	pingInterval: 2000,
	pingTimeout: 5000, // client is disconnected if it doesnt respond within this time
});
// share user context with socket
io.engine.use((req, res, next) => {
	const isHandshake = req._query.sid === undefined;
	if (isHandshake) { // apply only to first HTTP request of the session
		passport.authenticate("jwt", { session: false })(req, res, next);
	} else {
		next();
	}
});

io.on('connection', (socket) => {
	const req = socket.request;

	socket.join(`user:${req.user.user.id}`);
	socket.emit("whoami", {
		...req.user.user,
		queued: false,
	});

	// fetch online players
	const users = [];
	for (let [_, socket] of io.of("/").sockets) {
		let found = false;
		let queued = false;
		for (let user of users) {
			if (user.id === socket.request.user.user.id) {
				if (socket.rooms.has('queue')) {
					queued = true;
				}
				found = true;
				break;
			}
		}
		if (!found) {
			users.push({
				...socket.request.user.user,
				queued,
			});
		}
	}
	socket.emit("players", users);
	socket.emit("messages", getMessages());
	socket.emit("ships", getShips());

	// notify existing players
	socket.broadcast.emit("player connected", {
		...req.user.user,
		queued: false,
	});

	// HANDLERS

	socket.on("message", (content) => {
		const id = insertMessage(req.user.user.id, content);
		io.emit("message", getMessage(id));
	});

	socket.on("queue", async () => {
		if (socket.rooms.has('queue')) {
			socket.leave('queue');
		} else {
			socket.join('queue');
		}
		io.emit("queue", req.user.user.id);
		// console.log(io.sockets.adapter.rooms);
	});

	socket.on("updateship", (changes) => {
		for (let room of socket.rooms) {
			if (room.includes("game")) {
				const [_, p1id, p2id] = room.split(":");
				if (gameStore.updateShipFor(p1id, p2id, changes, req.user.user.id)) {
					// Only confirm the changes to the owner
					socket.emit("updateship", changes);
					// TODO communicate turn end
				}
				break;
			}
		}
	});

	// notify users upon disconnection
	socket.on("disconnect", async (reason) => {
		console.log(`Client disconnected: ${reason}`);

		// Check if there is any game room this socket was in
		for (let room of socket.rooms) {
			if (room.includes("game")) {
				const [_, p1id, p2id] = room.split(":");
				gameStore.endGame(p1id, p2id);
				// TODO communicate result to other player
				// TODO remove other player from game room
				break;
			}
		}

		// only when disconnected from all sockets, inform other users
		const sockets = await io.in(`user:${req.user.user.id}`).fetchSockets();
		if (sockets.length === 0) {
			socket.broadcast.emit("player disconnected", req.user.user.id);
		}
	});

	// Debugging
	socket.onAny((event, ...args) => {
		console.info(`IN '${event}'`, args);
	});
	socket.onAnyOutgoing((event, ...args) => {
		console.info(`OUT '${event}'`, args);
	});
});

function startGame(socket1, socket2, player1id, player2id) {
	socket1.leave('queue');
	socket2.leave('queue');
	io.emit("queue", player1id);
	io.emit("queue", player2id);

	const room = `game:${player1id}:${player2id}`;
	socket1.join(room);
	socket2.join(room);
	io.to(room).emit("start game", { player1: player1id, player2: player2id });

	gameStore.startGame(player1id, player2id);
}

async function processQueue() {
	const sockets = await io.in('queue').fetchSockets();
	if (sockets.length > 1) {
		// pick two random sockets that belong to different users
		const socket1 = sockets[Math.floor(Math.random() * sockets.length)];
		const socket2 = sockets[Math.floor(Math.random() * sockets.length)];
		const s1id = socket1.request.user.user.id;
		const s2id = socket2.request.user.user.id;
		if (s1id !== s2id) {
			startGame(socket1, socket2, s1id, s2id);
		}
	}
}

setInterval(() => {
	processQueue();
}, 2000);


// === START SERVER ===
const host = process.env.HOST || '0.0.0.0';
const port = (0 | process.env.PORT) || 3000;
httpServer.listen(port, host, () => {
	console.log(`Running at http://${host}:${port}`);
});
