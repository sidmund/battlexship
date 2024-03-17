<script>
    import { scale } from "svelte/transition";
    import ContentCard from "../common/ContentCard.svelte";
    import Button from "../common/Button.svelte";
    import ShipPreview from "./ShipPreview.svelte";
    import ShipSpecs from "./ShipSpecs.svelte";
    import IconTitle from "../common/IconTitle.svelte";

    export let ships = [];
    let fleet = [];
    const MAX_FLEET_SIZE = 5;

    let selected = 0;
    function onChange(event) {
        selected = event.currentTarget.value;
    }

    function onSelect() {
        const sel = ships[selected];
        if (fleet.find((ship) => ship.id === sel.id)) {
            fleet = fleet.filter((ship) => ship.id !== sel.id);
        } else if (fleet.length < MAX_FLEET_SIZE) {
            fleet = [...fleet, sel];
        }
    }
</script>

<ContentCard style="grid-row: 1 / 3;">
    <IconTitle>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 256 256"
            ><path
                fill="currentColor"
                d="M222.33 106.84L212 103.39V56a20 20 0 0 0-20-20h-52V24a12 12 0 0 0-24 0v12H64a20 20 0 0 0-20 20v47.39l-10.33 3.45a20 20 0 0 0-13.67 19v34.26a12.21 12.21 0 0 0 .46 3.29c16.34 57.25 88.68 76.76 103 80.09a20 20 0 0 0 9.06 0c14.33-3.33 86.67-22.84 103-80.09a12.21 12.21 0 0 0 .46-3.29v-34.28a20 20 0 0 0-13.65-18.98M68 60h120v35.38l-56.2-18.76a12 12 0 0 0-7.6 0L68 95.38Zm144 98.34c-13.46 42.62-73.44 59-84 61.55c-10.55-2.57-70.54-18.92-84-61.55v-29.65l72-24V168a12 12 0 0 0 24 0v-63.34l72 24Z"
            /></svg
        >
        <span>Battle fleet ({fleet.length}/{MAX_FLEET_SIZE})</span>
    </IconTitle>
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
                        <div
                            class="marker"
                            class:visible={fleet.find((s) => s.id === ship.id)}
                        />
                        <h3>{ship.name}</h3>
                    </label>
                </article>
            {/each}
        </div>
        <ShipPreview ship={ships[selected]} />
        <ShipSpecs ship={ships[selected]} />
    </main>
    <footer>
        <p>
            Select which ships to bring into battle. Once you join the queue,
            you can no longer change your fleet.
        </p>
        <Button textLeft="Select" on:click={onSelect} />
    </footer>
</ContentCard>

<style>
    main {
        display: grid;
        grid-template-columns: 200px 1fr 200px;
    }

    .ship {
        margin: 5px;
    }

    .ship label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        color: var(--grey);
    }

    .ship label .marker {
        height: 25px;
        width: 6px;
        border-radius: 2px;
    }

    .ship label .marker.visible {
        background: var(--yellow);
        box-shadow: 0 0 15px var(--yellow);
    }

    .ship [type="radio"] {
        display: none;
    }

    .ship [type="radio"]:checked ~ label {
        color: var(--white);
        text-shadow: 0 0 10px var(--white);
    }

    footer p {
        margin-bottom: 20px;
    }
</style>
