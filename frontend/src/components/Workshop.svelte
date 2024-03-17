<script>
    import { scale } from "svelte/transition";
    import StatBar from "./common/StatBar.svelte";

    export let ships = [];

    let selected = 0;
    function onChange(event) {
        selected = event.currentTarget.value;
        console.log(selected);
    }
</script>

<div class="workshop">
    <!-- Ship list -->
    <h1>Battle fleet</h1>
    <main>
        <div class="ships">
            {#each ships as ship, i (ship.id)}
                <article class="ship" in:scale>
                    <input
                        type="radio"
                        id="radio-{ship.id}"
                        name="selectedship"
                        value={i}
                        on:change={onChange}
                        checked={selected === i}
                    />
                    <label for="radio-{ship.id}">
                        <div class="marker" />
                        <h3>{ship.name}</h3>
                    </label>
                </article>
            {/each}
        </div>
        <div class="preview">
            <img
                src="assets/ships/{ships[selected].name}/Ship{ships[selected]
                    .name}Hull.png"
                alt="Ship"
            />
        </div>
        <div class="stats">
            <StatBar property="Size" value={ships[selected].size} max={5} />
            <StatBar property="Health" value={ships[selected].health} max={5} />
        </div>
    </main>
</div>

<style>
    .workshop {
        grid-row: 1 / 3;
        padding: 20px;
        border: 1px solid var(--white);
        background: rgba(0, 0, 0, 0.5);
    }

    .workshop main {
        display: grid;
        grid-template-columns: 200px 1fr 200px;
    }

    .ship label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
    }

    .ship label .marker {
        height: 20px;
        width: 5px;
        background: var(--yellow);
        box-shadow: 0 0 10px var(--yellow);
        border-radius: 2px;
        visibility: hidden;
    }

    .ship [type="radio"] {
        display: none;
    }

    .ship [type="radio"]:checked ~ label {
        color: var(--yellow);
        text-shadow: 0 0 10px var(--yellow);
    }

    .ship [type="radio"]:checked ~ label .marker {
        visibility: visible;
    }

    .preview {
        display: grid;
        place-content: center;
    }
</style>
