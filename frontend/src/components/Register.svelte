<script>
    import { api } from "../lib/util.js";
    import Button from "./common/Button.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let username;
    let password;
    let error;
    async function register() {
        if (!isValid) return;

        const response = await api("POST", "auth/register", {
            username,
            password,
        });
        if (!response.ok) {
            console.error(response);
            error = "Choose a different username";
            password = "";
            return;
        }

        const { token } = await response.json();
        dispatch("login", { token });
    }

    $: isValid =
        username && password && username.length > 2 && password.length > 2;
</script>

<form on:submit|preventDefault={register}>
    <label for="username">USERNAME</label>
    <input
        type="text"
        id="username"
        name="username"
        placeholder="Username..."
        bind:value={username}
    />
    <label for="password">PASSWORD</label>
    <input
        type="password"
        id="password"
        name="password"
        placeholder="Password..."
        bind:value={password}
    />
    <div></div>
    <Button disabled={!isValid} on:click={register} textLeft="Register" />
</form>

{#if error}
    <p>{error}</p>
{/if}
