<script>
    import Button from "./common/Button.svelte";
    import Login from "./Login.svelte";
    import Register from "./Register.svelte";
    import Practice from "./Practice.svelte";

    let menu = 0;
    function onLogin() {
        menu = 1;
    }
    function onRegister() {
        menu = 2;
    }
    function onPractice() {
        menu = 3;
    }
</script>

<main>
    <h1 class="logo">
        <span>Battle</span><span>&#215;</span><span>Ship</span>
    </h1>

    <div>
        {#if menu === 0}
            <Button on:click={onLogin} textLeft="Login" />
            <Button on:click={onRegister} textLeft="Register" />
            <Button
                on:click={onPractice}
                textLeft="Single"
                textRight="Player"
            />
        {:else if menu === 1}
            <Login on:login />
        {:else if menu === 2}
            <Register on:login />
        {:else if menu === 3}
            <Practice />
        {/if}
    </div>
</main>

<style>
    main {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .logo {
        margin-bottom: 50px;
    }
    .logo span:first-child {
        color: var(--yellow);
    }
    .logo span:nth-child(2) {
        color: var(--red);
    }
    .logo span:last-child {
        color: var(--cyan);
    }

    div {
        display: flex;
        gap: 20px;
    }
</style>
