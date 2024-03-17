<script>
    import { beforeUpdate, afterUpdate } from "svelte";
    import { scale } from "svelte/transition";
    import Button from "./common/Button.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let div;
    let autoscroll;

    beforeUpdate(() => {
        autoscroll =
            div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
    });

    afterUpdate(() => {
        if (autoscroll) div.scrollTo(0, div.scrollHeight);
    });

    export let messages = [];

    let message;
    function onMessage() {
        if (!message) return;
        dispatch("message", { message });
        message = "";
    }
</script>

<div class="chat">
    <h1>Chat</h1>
    <div class="scrollable" bind:this={div}>
        {#each messages as message (message.id)}
            <article class="message" in:scale>
                <strong>{message.username}</strong>:
                <span>{message.content}</span>
            </article>
        {/each}
    </div>
    <form on:submit|preventDefault={onMessage}>
        <input type="text" placeholder="Message..." bind:value={message} />
        <div>
            <Button disabled={!message} on:click={onMessage} textLeft="Send" />
        </div>
    </form>
</div>

<style>
    .chat {
        display: flex;
        flex-direction: column;
        border: 1px solid white;
    }

    .scrollable {
        flex: 1 1 auto;
        /* margin-bottom: 20px; */
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }

    .message {
        /* padding: 10px; */
        /* margin: 10px 15px; */
        max-width: 80%;
        width: fit-content;
    }
</style>
