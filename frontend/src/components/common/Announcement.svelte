<script>
    export let message;
</script>

<div class="announcement">
    <p>{message}</p>
</div>

<style>
    .announcement {
        position: absolute;
        right: 20px;
        bottom: 20px;
        max-width: 600px;
        padding: 16px;

        background: var(--purple);
        color: var(--yellow);
        border-radius: 2px;
        border-top: 6px solid var(--red);
        border-left: 8px double var(--magenta);
        border-right: 8px double var(--magenta);
        border-bottom: 8px double var(--magenta);

        font-family: "Orbitron";
        font-size: 18px;
    }
</style>
