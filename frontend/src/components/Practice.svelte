<script>
    import { onMount } from "svelte";
    import { gameStore } from "../stores/game";
    import { api } from "../lib/util";
    import Game from "./game/Game.svelte";
    import TransparentCard from "./common/TransparentCard.svelte";
    import BattleVs from "./game/BattleVS.svelte";

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
            ships,
        );
    });
</script>

<div class="container">
    <header>
        <TransparentCard>
            <h1>Practice Mode</h1>
        </TransparentCard>
        <BattleVs />
        <div></div>
    </header>
    <main>
        <Game />
    </main>
    <footer>
        {#if error}
            <p>{error}</p>
        {/if}
    </footer>
</div>

<style>
    .container {
        position: relative;
        display: grid;
        grid-template-rows: auto 1fr auto;
        height: 100vh;
        padding: 20px;
        gap: 20px;
    }

    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
