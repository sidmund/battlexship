<script>
    import StatBar from "./StatBar.svelte";

    export let ship;
</script>

<div class="specs">
    {#if ship}
        <h1>{ship.name}</h1>
        <div>
            <h4>[ SPECIFICATIONS ]</h4>
            <StatBar property="Size" value={ship.size} max={5} />
            <StatBar property="Health" value={ship.health} max={5} />
        </div>
        <div>
            <h4>[ WEAPONS ]</h4>
        </div>
    {/if}
</div>

<style>
    .specs {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .specs h1 {
        text-align: center;
    }
</style>
