<script>
    export let player;
</script>

<div class="player">
    <i class="icon connected" />
    <span class="name">
        {player.username}
        {#if player.queued}
            <span>(ready)</span>
        {/if}
    </span>
</div>

<style>
    .player {
        display: flex;
        align-items: center;
    }

    .player .name {
        color: var(--yellow);
    }

    .icon {
        display: inline-block;
        height: 10px;
        width: 10px;
        background-color: var(--red);
        transform: rotate(45deg);
        margin-right: 5px;
    }

    .icon.connected {
        background-color: var(--cyan);
    }
</style>
