<script>
    export let textLeft;
    export let textRight = null;
    export let disabled = false;
</script>

{#if textRight}
    <button on:click {disabled} data-test={`${textLeft}${textRight}`}>
        <span>{textLeft}</span>. <span>/</span><span>/</span>
        {textRight}
    </button>
{:else}
    <button on:click {disabled} data-test={textLeft}>
        <span>{textLeft}</span>. <span>&#8726;</span><span></span>
    </button>
{/if}
