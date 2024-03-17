<script>
    export let origin_x = null;
    export let origin_y = null;
    export let x;
    export let y;
    export let angle;
    export let dist;
    export let opacity;
</script>

<g {opacity} data-test="missile">
    <!-- Trail -->
    {#if origin_x !== null && origin_y !== null}
        <line
            x1={origin_x + 0.5}
            y1={origin_y + 0.5}
            x2={x + 0.5}
            y2={y + 0.5}
            stroke="grey"
            stroke-width="0.03"
            stroke-dasharray="0.1"
            stroke-opacity="0.5"
        />
    {/if}

    <!-- Outline -->
    <rect
        {x}
        {y}
        width={1}
        height={1}
        stroke="white"
        stroke-width="0.03"
        fill="none"
    />

    <!-- Distance label -->
    <text
        x={x + 0.5}
        y={y + 1.1}
        font-size="0.3"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="white"
    >
        {Math.round(dist)}m
    </text>

    <!-- Missile image -->
    <g class="rotatable" transform="rotate({angle})">
        <image
            href="assets/ships/Plane/Missile.png"
            x={x + 0.25}
            y={y + 0.25}
            width={0.5}
            height={0.5}
        />
    </g>
</g>
