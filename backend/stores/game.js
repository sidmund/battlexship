class GameStore {
    startGame(p1id, p2id) { }
    findGameFor(p1id, p2id) { }
    updateShipFor(p1id, p2id, changes, pid) { }
    endGame(p1id, p2id) { }
}

export class InMemoryGameStore extends GameStore {
    constructor() {
        super();
        this.games = {};
    }

    startGame(p1id, p2id, ships) {
        this.games[`${p1id}:${p2id}`] = {
            player1: {
                id: p1id,
                ships: ships.map((ship, index) => ({
                    ...ship,
                    health: ship.size,
                    x: index,
                    y: 0,
                    hullAngle: 0,
                }))
            },
            player2: {
                id: p2id,
                ships: ships.map((ship, index) => ({
                    ...ship,
                    health: ship.size,
                    x: index,
                    y: 0,
                    hullAngle: 0,
                }))
            },
            turn: p1id
        }
    }

    findGameFor(p1id, p2id) {
        return this.games[`${p1id}:${p2id}`];
    }

    updateShipFor(p1id, p2id, changes, pid) {
        const game = this.findGameFor(p1id, p2id);
        if (!game) {
            return false;
        }

        if ((game.player1.id === pid || game.player2.id === pid) && game.turn === pid) {
            const playerData = game.player1.id === pid ? game.player1 : game.player2;
            for (let ship of playerData.ships) {
                if (ship.name === changes.name) {
                    ship = {
                        ...ship,
                        ...changes,
                    };
                    break;
                }
            }
        }

        // TODO also validate move here
        return true;
    }

    endGame(p1id, p2id) {
        delete this.games[`${p1id}:${p2id}`];
        // TODO persist result to db
    }
}