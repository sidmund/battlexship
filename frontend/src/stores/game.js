import { writable } from "svelte/store";

function createGameStore() {
    const start = {
        player1: null,
        player2: null,
        myTurn: false,
        mode: "place",
        ships: [],
        status: null,
    };

    const { set, update, subscribe } = writable(start);

    function newGame(player1, player2, myTurn, ships) {
        const myShips = ships.map((ship, index) => ({
            ...ship,
            health: ship.size,
            x: index,
            y: 0,
            hullAngle: 0,
        }));
        set({
            ...start,
            player1,
            player2,
            myTurn,
            ships: myShips,
            mode: "place",
            status: "playing",
        });
    }

    function setMode(mode) {
        update((prev) => {
            return { ...prev, mode };
        });
    }

    function shipAt(prev, x, y) {
        for (let ship of prev.ships) {
            if (ship.hullAngle === 0) {
                if (x === ship.x && y >= ship.y && y < ship.y + ship.size) {
                    return ship;
                }
            } else {
                if (y === ship.y && x >= ship.x && x < ship.x + ship.size) {
                    return ship;
                }
            }
        }
    }

    function isValid(prev, name, size, hullAngle, x, y) {
        if (hullAngle === 0) {
            if (x < 0 || x > 9 || y < 0 || y > 9 - size + 1) return false;
        } else {
            if (x < 0 || x > 9 - size + 1 || y < 0 || y > 9) return false;
        }

        for (let i = 0; i < size; i++) {
            if (hullAngle === 0) {
                const other = shipAt(prev, x, y + i);
                if (other && other.name !== name) return false;
            } else {
                const other = shipAt(prev, x + i, y);
                if (other && other.name !== name) return false;
            }
        }

        return true;
    }

    function moveShip({ name, hullAngle, x, y }) {
        let moved = false;
        update((prev) => {
            const ship = prev.ships.find((s) => s.name === name);
            if (ship && isValid(prev, name, ship.size, hullAngle, x, y)) {
                ship.x = x;
                ship.y = y;
                ship.hullAngle = hullAngle;
                moved = true;
            }
            return prev;
        });
        return moved;
    }

    function stopOnPlayerDisconnect(id) {
        update((prev) => {
            if (prev.status === "playing" && (id === prev.player1.id || id === prev.player2.id)) {
                return { ...prev, status: "gameover" };
            }
            return prev;
        });
    }

    return {
        subscribe,
        newGame,
        setMode,
        moveShip,
        stopOnPlayerDisconnect,
    };
}

export const gameStore = createGameStore();
