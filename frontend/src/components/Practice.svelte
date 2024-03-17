<script>
    import { onMount } from "svelte";
    import { gameStore } from "../stores/game";
    import { api } from "../lib/util";
    import Game from "./game/Game.svelte";

    let ships = JSON.parse(localStorage.getItem("ships")) || [];
    let error;

    onMount(async () => {
        if (ships.length === 0) {
            const res = await api("GET", "game/ships");
            if (res.ok) {
                const data = await res.json();
                ships = data.ships;
                localStorage.setItem("ships", JSON.stringify(ships));
            } else {
                error = "[OFFLINE] Cannot retrieve game data";
                return;
            }
        }

        gameStore.newGame(
            { username: "You" },
            { username: "Computer" },
            true,
            ships
        );
    });
</script>

<header>
    <h1>Practice mode</h1>
</header>
<main>
    {#if error}
        <p>{error}</p>
    {/if}
    <Game />
</main>
