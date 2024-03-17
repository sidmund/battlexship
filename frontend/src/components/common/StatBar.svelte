<script>
    export let property;
    export let value;
    export let max;
</script>

<article class="stat">
    <span>{property}</span>
    <span>
        {#each { length: max } as _, i}
            <div class="dot" class:empty={i >= value} />
        {/each}
    </span>
</article>

<style>
    .stat {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .dot {
        width: 12px;
        height: 12px;
        background: var(--yellow);
        display: inline-block;
        border-radius: 1px;
        margin: 0 2px;
    }

    .dot.empty {
        background: var(--cyan-dark);
    }
</style>
