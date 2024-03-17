<script>
    import { io } from "socket.io-client";
    import { gameStore } from "../stores/game";
    import PlayerBadge from "./common/PlayerBadge.svelte";
    import Chat from "./Chat.svelte";
    import Workshop from "./Workshop.svelte";
    import PlayersList from "./PlayersList.svelte";
    import Button from "./common/Button.svelte";
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    import Game from "./Game.svelte";
    import ConnectionStatus from "./common/ConnectionStatus.svelte";
    import Background from "./common/Background.svelte";

    const dispatch = createEventDispatcher();

    let socket;
    let status = "disconnected";
    let socketId = "-";

    let me = JSON.parse(localStorage.getItem("me"));
    let players = JSON.parse(localStorage.getItem("players")) || [];
    let messages = JSON.parse(localStorage.getItem("messages")) || [];
    let ships = JSON.parse(localStorage.getItem("ships")) || [];

    $: inQueue = me && me.queued;

    function onLogout() {
        socket.disconnect();
        dispatch("logout");
    }

    const onQueue = () => socket.emit("queue");
    const onMessage = (event) => socket.emit("message", event.detail.message);
    const onUpdateShip = (event) =>
        socket.emit("updateship", event.detail.changes);

    // --- SOCKET HANDLING ---

    let socketHandlers = [];
    const registerSocketHandler = (eventName, callback) => {
        socketHandlers.push(eventName);
        socket.on(eventName, callback);
    };
    const unregisterSocketHandlers = () => {
        socketHandlers.forEach((eventName) => socket.off(eventName));
        socketHandlers = [];
    };

    onMount(() => {
        socket = io(import.meta.env.VITE_SERVER_URL, {
            // only works if HTTP long-polling is enabled, since WebSockets do not support providing additional headers
            extraHeaders: {
                authorization: `bearer ${localStorage.getItem("token")}`,
            },
        });

        registerSocketHandler("connect", () => {
            status = "connected";
            socketId = socket.id;
        });

        registerSocketHandler("whoami", (user) => {
            me = user;
            localStorage.setItem("user", me);
        });

        registerSocketHandler("players", (users) => {
            users.forEach((player) => {
                player.self = player.id === me.id;
            });
            // put the current user first, and then sort by username
            players = users.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
        });

        registerSocketHandler("player connected", (player) => {
            for (let p of players) {
                if (p.id === player.id) {
                    return;
                }
            }
            players = [...players, player];
        });

        registerSocketHandler("player disconnected", (id) => {
            players = players.filter((p) => p.id !== id);
            gameStore.stopOnPlayerDisconnect(id);
        });

        registerSocketHandler("messages", (allMessages) => {
            messages = allMessages;
            localStorage.setItem("messages", JSON.stringify(messages));
        });

        registerSocketHandler("message", (message) => {
            messages = [...messages, message];
            localStorage.setItem("messages", JSON.stringify(messages));
        });

        registerSocketHandler("ships", (allShips) => {
            ships = allShips;
            localStorage.setItem("ships", JSON.stringify(ships));
        });

        registerSocketHandler("queue", (id) => {
            for (let p of players) {
                if (p.id === id) {
                    p.queued = !p.queued;
                    if (p.id === me.id) {
                        me.queued = !me.queued;
                    }
                    break;
                }
            }
            players = players;
        });

        registerSocketHandler("start game", (details) => {
            let player1;
            let player2;
            let myTurn = false;
            for (let p of players) {
                if (p.id === details.player1) {
                    player1 = p;
                    myTurn = p.id === me.id;
                } else if (p.id === details.player2) {
                    player2 = p;
                }
            }
            gameStore.newGame(player1, player2, myTurn, ships);
        });

        registerSocketHandler("updateship", (changes) => {
            // changes confirmed, ignore?
        });

        registerSocketHandler("disconnect", () => {
            status = "disconnected";
            socketId = "-";
        });

        registerSocketHandler("connect_error", (err) => {
            console.error(err);
            // low-level errors (server down e.g) or middleware errors
            status = "error";
        });

        // Debugging
        socket.onAny((event, ...args) => {
            console.info(`IN '${event}'`, args);
        });
        socket.onAnyOutgoing((event, ...args) => {
            console.info(`OUT '${event}'`, args);
        });
    });

    onDestroy(() => {
        unregisterSocketHandlers();
    });
</script>

<Background src="assets/images/workshop.jpg" />
<header>
    <div>
        {#if me}
            <PlayerBadge bind:player={me} />
        {/if}
    </div>
    <div>
        <Button on:click={onLogout} textLeft="Logout" />
    </div>
</header>
<main>
    {#if $gameStore.status === "playing"}
        <Game on:updateship={onUpdateShip} />
    {:else}
        <div class="lobby">
            <Workshop bind:ships />
            <PlayersList bind:players {inQueue} on:queue={onQueue} />
            <Chat bind:messages on:message={onMessage} />
        </div>
    {/if}
</main>
<footer>
    <ConnectionStatus {status} {socketId} />
</footer>

<style>
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
    }

    .lobby {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 20px;
        padding: 20px;
    }

    footer {
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 20px;
    }
</style>
