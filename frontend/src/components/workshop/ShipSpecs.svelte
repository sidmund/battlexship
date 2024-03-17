<script>
    import Button from "../common/Button.svelte";
    import StatBar from "../common/StatBar.svelte";

    export let ship;
</script>

<div class="specs">
    <h1>{ship.name}</h1>
    <div>
        <h4>[ SPECIFICATIONS ]</h4>
        <StatBar property="Size" value={ship.size} max={5} />
        <StatBar property="Health" value={ship.health} max={5} />
    </div>
    <div>
        <h4>[ WEAPONS ]</h4>
    </div>
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
