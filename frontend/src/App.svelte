<script>
    import { onMount } from "svelte";
    import Title from "./components/Title.svelte";
    import Lobby from "./components/Lobby.svelte";

    let loggedIn = false;

    function onLogin(event) {
        localStorage.setItem("token", event.detail.token);
        loggedIn = true;
    }

    function onLogout() {
        localStorage.clear();
        loggedIn = false;
    }

    async function checkLogin() {
        const token = localStorage.getItem("token"); // shared across tabs
        if (!token) {
            loggedIn = false;
            return;
        }

        try {
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/auth/self`,
                {
                    headers: {
                        authorization: `bearer ${token}`,
                    },
                },
            );
            loggedIn = res.status === 200;
        } catch (error) {
            console.error(error);
            loggedIn = false;
        }
    }

    onMount(() => {
        checkLogin();
    });
</script>

{#if loggedIn}
    <Lobby on:logout={onLogout} />
{:else}
    <Title on:login={onLogin} />
{/if}
