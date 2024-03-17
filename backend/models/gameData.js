import db from '../index.js';


export const getOutgoingRequests = (user_id) => {
    return db.prepare('SELECT * FROM request WHERE from_id = ?').all(user_id);
}

export const getIncomingRequests = (user_id) => {
    return db.prepare('SELECT * FROM request WHERE to_id = ?').all(user_id);
}

/**
 * Insert a pending match request.
 * @param {int} player_id the requesting player
 * @param {int} opponent_id the opponent
 * @returns number of records inserted
 */
export const insertMatchRequest = (player_id, opponent_id) => {
    let result = db.prepare('INSERT INTO request (from_id, to_id) VALUES (?, ?)').run(player_id, opponent_id);
    return result.changes;
}

export const updateRequest = (id, status) => {
    let result = db.prepare('UPDATE request SET status = ? WHERE id = ?').run(status, id);
    return result.changes;
    // TODO create and return a new game if status is 1?
}

export const getShips = () => {
    return db.prepare('SELECT * FROM ship').all();
}

// MESSAGING

export const getMessages = () => {
    return db.prepare('SELECT m.id, m.from_id, a.username, m.content, m.time_sent FROM message m JOIN account a ON m.from_id = a.id').all();
}

export const getMessage = (id) => {
    return db.prepare('SELECT m.id, m.from_id, a.username, m.content, m.time_sent FROM message m JOIN account a ON m.from_id = a.id WHERE m.id = ?').get(id);
}

export const insertMessage = (user_id, content) => {
    let result = db.prepare('INSERT INTO message (from_id, content) VALUES (?, ?)').run(user_id, content);
    return result.lastInsertRowid;
}

// GAMEPLAY STATS
// TODO when getting a player for the badge, also put in these stats

export const getMatchesWon = (username) => {
    return db.prepare('SELECT count(*) as wins FROM account a ' +
        'JOIN game g ON g.winning_player_id = a.id ' +
        'WHERE a.username = ?').get(username);
}

export const getMatchesPlayed = (username) => {
    return db.prepare('SELECT count(*) as matches FROM account a ' +
        'JOIN game g ON g.player1_id = a.id OR g.player2_id = a.id ' +
        'WHERE a.username = ? AND g.playing = false').get(username);
}

export const isInGame = (username) => {
    return db.prepare('SELECT count(*) as current FROM account a ' +
        'JOIN game g ON g.player1_id = a.id OR g.player2_id = a.id ' +
        'WHERE a.username = ? AND g.playing = true').get(username);
}
