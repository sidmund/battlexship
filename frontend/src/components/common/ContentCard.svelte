<script>
    export let style = "";
</script>

<div class="transparent-card" {style}>
    <slot />
</div>

<style>
    .transparent-card {
        position: relative;
        height: 100%;
        display: grid;
        grid-template-rows: auto 1fr auto;

        background: var(--blue-translucent);
        padding: 20px;
        border-radius: 5px;
    }
</style>
