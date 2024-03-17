<script>
    import { gameStore } from "../../stores/game";
</script>

{#if $gameStore.player1 && $gameStore.player2}
    <h1>
        <span>{$gameStore.player1.username}</span>
        <span>vs</span>
        <span>{$gameStore.player2.username}</span>
    </h1>
{/if}

<style>
    h1 {
        color: var(--red);
    }

    h1 :first-child {
        color: var(--yellow);
    }

    h1 :last-child {
        color: var(--cyan);
    }
</style>
