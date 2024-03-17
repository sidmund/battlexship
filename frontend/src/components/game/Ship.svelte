<script>
    export let x;
    export let y;
    export let size;
    export let health;
    export let hullAngle;
    export let src;
    export let name;
    export let selected;

    export let turretX = null;
    export let turretY = null;
    export let turretAngle = null;

    export let planeX = null;
    export let planeY = null;
    export let planeAngle = null;

    const textColor = "var(--white)";
    const selColor = "var(--yellow)";

    $: sunk = health <= 0;
    $: correction = -(size % 2 === 0 ? size / 2 - 0.5 : Math.floor(size / 2));
</script>

{#if hullAngle === 0}
    {#if selected}
        <!-- Draw ship highlight -->
        <rect
            {x}
            {y}
            width={1}
            height={size}
            fill="none"
            stroke={selColor}
            stroke-width="0.06"
        />
        <text
            x={x + 0.5}
            y={y + size + 0.5}
            font-size="0.4"
            text-anchor="middle"
            dominant-baseline="middle"
            fill={textColor}
        >
            {name}
        </text>
    {/if}
    <g class:sunk>
        <image data-test="ship" href={src} {x} {y} width={1} height={size} />
    </g>
{:else}
    {#if selected}
        <rect
            {x}
            {y}
            width={size}
            height={1}
            fill="none"
            stroke={selColor}
            stroke-width="0.06"
        />
        <text
            x={x + size / 2}
            y={y + 0.5}
            font-size="0.4"
            text-anchor="middle"
            dominant-baseline="middle"
            fill={textColor}
        >
            {name}
        </text>
    {/if}
    <g
        class:sunk
        class="rotatable"
        transform="rotate({hullAngle}) translate({correction}, {correction})"
    >
        <image data-test="ship" href={src} {x} {y} width={1} height={size} />
    </g>
{/if}

{#if turretX !== null}
    <g class:sunk class="rotatable" transform="rotate({turretAngle})">
        <image
            href="assets/ships/Battleship/WeaponBattleshipStandardGun.png"
            x={x + turretX}
            y={y + turretY}
            width={1}
            height={1}
        />
    </g>
{/if}

{#if planeX !== null}
    <g class:sunk class="rotatable" transform="rotate({planeAngle})">
        <image
            href="assets/ships/Plane/PlaneF-35Lightning2.png"
            x={planeX}
            y={planeY}
            width={1}
            height={1}
        />
    </g>
{/if}
