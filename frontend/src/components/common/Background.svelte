<script>
    export let src;
</script>

<div class="background" style="background-image: url({src})" />

<style>
    .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-position: center;
        background-size: cover;
    }
</style>
