<script>
    import { gameStore } from "../../stores/game";

    export let actionsLeft = 1;

    function select(action) {
        actionsLeft -= 1;
        gameStore.setMode(action);
    }
</script>

<footer class="actions">
    <button
        class:active={$gameStore.mode === "fire"}
        disabled={actionsLeft <= 0}
        on:click={() => select("fire")}
    >
        <img src="assets/ships/Plane/Missile.png" alt="Fire missile" />
        <caption>Fire</caption>
    </button>
</footer>

<style>
    .actions {
        margin: 10px;
        display: flex;
        gap: 10;
    }

    .actions button {
        padding: 5px 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        border: 2px solid grey;
        height: 80px;
        width: 80px;
    }

    .actions button.active {
        border: 2px solid var(--red);
    }

    .actions button img {
        transform: rotate(45deg);
        height: 32px;
        width: 32px;
        image-rendering: pixelated;
    }

    .actions button caption {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-family: "Orbitron";
    }
</style>
