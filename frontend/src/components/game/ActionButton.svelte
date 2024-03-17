<script>
    export let active = false;
    export let disabled = false;
    export let src;
    export let desc;
</script>

<button class:active {disabled} on:click>
    <img {src} alt={desc} />
    <caption>{desc}</caption>
</button>

<style>
    button {
        padding: 5px 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        border: 2px solid grey;
        height: 80px;
        width: 80px;
    }

    button.active {
        border: 2px solid var(--red);
    }

    button img {
        transform: rotate(45deg);
        height: 32px;
        width: 32px;
        image-rendering: pixelated;
    }

    button caption {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-family: "Orbitron";
    }
</style>
