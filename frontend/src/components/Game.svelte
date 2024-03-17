<script>
    import { onMount } from "svelte";
    import { signal, animate, all } from "../lib/motion.js";
    import { gameStore } from "../stores/game.js";
    import Actions from "./game/Actions.svelte";
    import Grid from "./game/Grid.svelte";
    import Missile from "./game/Missile.svelte";
    import Ship from "./game/Ship.svelte";
    import Button from "./common/Button.svelte";
    import { createEventDispatcher } from "svelte";
    import Background from "./common/Background.svelte";

    const dispatch = createEventDispatcher();

    const svg = signal({ x: -1, y: -1, w: 24, h: 12 });
    let svgElement;

    let missiles = signal({});
    let selectedShip = null;

    // Svelte only allows top-level store declarations unfortunately
    // Object coords are relative to 0,0
    const carrier = signal({
        name: "Carrier",
        src: "assets/ships/Carrier/ShipCarrierHull.png",
        x: 0,
        y: 0,
        size: 5,
        health: 5,
        hullAngle: 0,
        planeX: 0, // independent of ship x,y
        planeY: 3,
        planeAngle: 0,
        selected: false,
    });
    const battleship = signal({
        name: "Battleship",
        src: "assets/ships/Battleship/ShipBattleshipHull.png",
        x: 1,
        y: 0,
        size: 4,
        health: 4,
        hullAngle: 0, // 0 for vertical, 90 for horizontal orientation
        turretX: 0, // relative to ship x,y
        turretY: 2,
        turretAngle: 90,
        selected: false,
    });
    const cruiser = signal({
        name: "Cruiser",
        src: "assets/ships/Cruiser/ShipCruiserHull.png",
        x: 2,
        y: 0,
        size: 3,
        health: 3,
        hullAngle: 0,
        turretX: 0, // relative to ship x,y
        turretY: 2,
        turretAngle: 90,
        selected: false,
    });
    const submarine = signal({
        name: "Submarine",
        src: "assets/ships/Submarine/ShipSubmarineHull.png",
        x: 3,
        y: 0,
        size: 3,
        health: 3,
        hullAngle: 0,
        turretX: 0, // relative to ship x,y
        turretY: 0,
        turretAngle: 90,
        selected: false,
    });
    const destroyer = signal({
        name: "Destroyer",
        src: "assets/ships/Destroyer/ShipDestroyerHull.png",
        x: 4,
        y: 0,
        size: 2,
        health: 2,
        hullAngle: 0,
        turretX: 0, // relative to ship x,y
        turretY: 0,
        turretAngle: 90,
        selected: false,
    });

    function shipAt(x, y) {
        let name;
        for (let ship of $gameStore.ships) {
            if (ship.hullAngle === 0) {
                if (x === ship.x && y >= ship.y && y < ship.y + ship.size) {
                    name = ship.name;
                    break;
                }
            } else {
                if (y === ship.y && x >= ship.x && x < ship.x + ship.size) {
                    name = ship.name;
                    break;
                }
            }
        }

        if (name === "Carrier") return carrier;
        if (name === "Battleship") return battleship;
        if (name === "Cruiser") return cruiser;
        if (name === "Submarine") return submarine;
        if (name === "Destroyer") return destroyer;
        return null;
    }

    function confirmPlacement() {
        gameStore.setMode(null);
    }

    let highlighted = [];

    async function fireAt(mouse, target) {
        const { top, left, width } = svgElement.getBoundingClientRect();
        const cellSize = width / 24;

        gameStore.setMode(null);

        // turret coords in screen pixels within svg
        const turretX =
            ($selectedShip.x + $selectedShip.turretX + 1) * cellSize; // +1 for edge offset
        const turretY =
            ($selectedShip.y + $selectedShip.turretY + 1) * cellSize;
        const angle =
            90 +
            (Math.atan2(mouse.y - top - turretY, mouse.x - left - turretX) *
                180) /
                Math.PI;
        const dist = Math.hypot(
            mouse.x - left - turretX,
            mouse.y - top - turretY,
        );

        await selectedShip.to({ turretAngle: angle }, { duration: 1000 });
        const m1 = {
            origin_x: $selectedShip.x + $selectedShip.turretX,
            origin_y: $selectedShip.y + $selectedShip.turretY,
            x: $selectedShip.x + $selectedShip.turretX,
            y: $selectedShip.y + $selectedShip.turretY,
            angle,
            opacity: 1,
            dist,
        };
        missiles = signal({ m1 });
        await missiles
            .to(
                // Properties we dont specify are lost when we use a map of objects, hence the unpack
                { m1: { ...m1, x: target.x, y: target.y, dist: 0 } },
                { duration: 800 },
            )
            .to({
                m1: { ...m1, x: target.x, y: target.y, dist: 0, opacity: 0 },
            });

        highlighted = [];
        missiles = signal({});
    }

    async function handleClick(event) {
        const { top, left, width } = svgElement.getBoundingClientRect();
        const cellSize = width / 24;
        const mouse = { x: event.clientX, y: event.clientY };

        const target = {
            x: Math.floor((mouse.x - left - cellSize) / cellSize), // -cellSize for edge offset
            y: Math.floor((mouse.y - top - cellSize) / cellSize),
        };
        // Left grid x: 0-9
        // Right grid x: 12-21

        if ($gameStore.mode === "fire") {
            // can only target second grid
            if (
                target.y >= 0 &&
                target.y < 10 &&
                target.x > 11 &&
                target.x < 22
            ) {
                selectedShip = battleship; // TODO randomize
                fireAt(mouse, target);
            }
        } else if ($gameStore.mode === "place") {
            if (target.y < 0 || target.y > 9 || target.x < 0 || target.x > 9)
                return;

            const ship = shipAt(target.x, target.y);
            if (ship && !selectedShip) {
                // We dont have one selected, so pick it up
                ship.now({ selected: true });
                selectedShip = ship;
            } else if (!ship && selectedShip) {
                // There is no ship, so place it down
                const changes = {
                    name: $selectedShip.name,
                    hullAngle: $selectedShip.hullAngle,
                    x: target.x,
                    y: target.y,
                };
                if (gameStore.moveShip(changes)) {
                    dispatch("updateship", { changes });
                    await selectedShip.to(
                        { x: changes.x, y: changes.y, selected: false },
                        { duration: 500 },
                    );
                    selectedShip = null;
                }
            } else if (ship && selectedShip) {
                // Ignore attempted placement
            }
        }
    }

    async function handleRightClick(event) {
        if ($gameStore.mode === "place") {
            if (selectedShip) {
                const changes = {
                    name: $selectedShip.name,
                    hullAngle: 90,
                    x: $selectedShip.x,
                    y: $selectedShip.y,
                };
                if (gameStore.moveShip(changes)) {
                    dispatch("updateship", { changes });
                    await selectedShip.to(
                        { hullAngle: changes.hullAngle, selected: false },
                        { duration: 500 },
                    );
                    selectedShip = null;
                }
            }
        }
    }

    function handleMouseMove(event) {
        const { top, left, width } = svgElement.getBoundingClientRect();
        const cellSize = width / 24;
        const mouse = { x: event.clientX, y: event.clientY };

        if ($gameStore.mode === "fire") {
            // NB these are relative to the origin of the 2nd grid
            const target = {
                x: Math.floor(
                    (mouse.x - (left + width / 2) - cellSize) / cellSize,
                ), // -cellSize for edge offset
                y: Math.floor((mouse.y - top - cellSize) / cellSize),
            };
            // we highlight only in the second grid
            if (target.x < 0 || target.y < 0 || target.x > 9 || target.y > 9) {
                highlighted = [];
                return;
            }
            highlighted = [target];
        } else if ($gameStore.mode === "place") {
            // NB these are relative to the origin of the 1st grid
            const target = {
                x: Math.floor((mouse.x - left - cellSize) / cellSize), // -cellSize for edge offset
                y: Math.floor((mouse.y - top - cellSize) / cellSize),
            };

            // we highlight only in the first grid
            if (target.x < 0 || target.y < 0 || target.x > 9 || target.y > 9) {
                highlighted = [];
                return;
            }
            highlighted = [target];
        }
    }

    function handleKeys(event) {}

    onMount(() => {});
</script>

<svelte:document
    on:mousemove={handleMouseMove}
    on:click={handleClick}
    on:contextmenu|preventDefault={handleRightClick}
    on:keyup={handleKeys}
/>

<Background src="assets/images/battle.jpg" />
<header>
    {#if $gameStore.player1 && $gameStore.player2}
        <h1>{$gameStore.player1.username} VS {$gameStore.player2.username}</h1>
    {/if}
</header>
<main>
    <svg bind:this={svgElement} viewBox="{$svg.x} {$svg.y} {$svg.w} {$svg.h}">
        <Grid
            size={10}
            highlighted={$gameStore.mode === "place" ? highlighted : []}
        />

        <Ship {...$carrier} />
        <Ship {...$battleship} />
        <Ship {...$cruiser} />
        <Ship {...$submarine} />
        <Ship {...$destroyer} />

        <Grid
            size={10}
            offsetX={12}
            highlighted={$gameStore.mode === "fire" ? highlighted : []}
        />

        {#each Object.values($missiles) as missile}
            <Missile {...missile} />
        {/each}
    </svg>
</main>
{#if $gameStore.mode !== "place"}
    <Actions />
{:else}
    <footer>
        <p>Place your ships. R-click to rotate.</p>
        <Button on:click={confirmPlacement} textLeft="Confirm" />
    </footer>
{/if}

<style>
    main {
        display: grid;
        place-content: center;
    }
    svg {
        width: 1200px;
        height: 600px;
    }
</style>
