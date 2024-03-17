<script>
    export let status;
    export let socketId;
</script>

<p title={status}>
    {#if status === "connected"}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
        >
            <path
                fill="green"
                d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8"
            />
            <path
                fill="green"
                d="M9.999 13.587L7.7 11.292l-1.412 1.416l3.713 3.705l6.706-6.706l-1.414-1.414z"
            />
        </svg>
    {:else if status === "disconnected"}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
        >
            <path
                fill="red"
                d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.493 2 11.953 2M12 20c-4.411 0-8-3.589-8-8s3.567-8 7.953-8C16.391 4 20 7.589 20 12s-3.589 8-8 8"
            />
            <path fill="red" d="M11 7h2v7h-2zm0 8h2v2h-2z" />
        </svg>
    {:else}
        <!-- error -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
        >
            <path
                fill="red"
                d="M9.172 16.242L12 13.414l2.828 2.828l1.414-1.414L13.414 12l2.828-2.828l-1.414-1.414L12 10.586L9.172 7.758L7.758 9.172L10.586 12l-2.828 2.828z"
            />
            <path
                fill="red"
                d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2S2 6.486 2 12s4.486 10 10 10m0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8s-8-3.589-8-8s3.589-8 8-8"
            />
        </svg>
    {/if}
    {socketId}
</p>

<style>
    p {
        user-select: none;
        display: flex;
        align-items: center;
        gap: 5px;
    }
</style>
