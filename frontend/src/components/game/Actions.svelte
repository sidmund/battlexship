<script>
    import { gameStore } from "../../stores/game";
    import { createEventDispatcher } from "svelte";
    import ActionButton from "./ActionButton.svelte";
    import Button from "../common/Button.svelte";

    const dispatch = createEventDispatcher();

    export let actionsLeft = 999;

    function select(action) {
        actionsLeft -= 1;
        gameStore.setMode(action);
    }
</script>

<div class="actions">
    {#if $gameStore.mode === "place"}
        <p>
            Place your ships.<br />
            R-click to rotate.
        </p>
        <Button on:click={() => dispatch("placed")} textLeft="Confirm" />
    {:else}
        <ActionButton
            active={$gameStore.mode === "fire"}
            disabled={actionsLeft <= 0}
            on:click={() => select("fire")}
            src="assets/ships/Plane/Missile.png"
            desc="Fire"
        />
        <ActionButton
            active={false}
            disabled={false}
            on:click={() => {}}
            src="assets/ships/Plane/PlaneF-35Lightning2.png"
            desc="Bomb"
        />
    {/if}
</div>

<style>
    .actions {
        display: flex;
        align-items: center;
        gap: 10px;
    }
</style>
