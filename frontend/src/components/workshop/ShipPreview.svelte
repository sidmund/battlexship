<script>
    export let ship;
</script>

<div class="preview">
    {#if ship}
        <img
            src="assets/ships/{ship.name}/Ship{ship.name}Hull.png"
            alt="Ship"
        />
    {/if}
</div>

<style>
    .preview {
        justify-self: center;
        display: grid;
        place-content: center;
        height: 300px;
        width: 300px;
        /* background-color: var(--blue); */
        /* border-radius: 50%; */
    }

    .preview img {
        -webkit-filter: drop-shadow(0 0 40px var(--cyan));
        filter: drop-shadow(0 0 40px var(--cyan));
        animation: rotate 60s linear infinite;
    }
</style>
