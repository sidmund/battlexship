<script>
    import { scale } from "svelte/transition";
    import Button from "./common/Button.svelte";
    import PlayerCompact from "./common/PlayerCompact.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let players = [];
    export let inQueue = false;
</script>

<div class="players-list">
    <h1>
        <span>Players</span>
        <Button
            on:click={() => dispatch("queue")}
            textLeft={inQueue ? "Leave" : "Join"}
            textRight="Queue"
        />
    </h1>
    <div>
        {#each players as player (player.id)}
            <div in:scale>
                <PlayerCompact bind:player />
            </div>
        {/each}
    </div>
</div>

<style>
    .players-list {
        /* border: 1px solid var(--white); */
        width: 100%;
    }

    h1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
