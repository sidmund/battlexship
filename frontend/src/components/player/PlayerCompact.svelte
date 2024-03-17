<script>
    import { scale } from "svelte/transition";

    export let player;
</script>

<div class="player" in:scale>
    <i class="icon connected" title="Online" />
    {#if player.queued}
        <i class="icon ready" title="In queue" />
    {/if}
    <span class="name">{player.username}</span>
</div>

<style>
    .player {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .icon {
        height: 10px;
        width: 10px;
        transform: rotate(45deg);
        background-color: var(--red);
    }

    .icon.connected {
        background-color: var(--cyan);
    }

    .icon.ready {
        background-color: var(--orange);
    }
</style>
