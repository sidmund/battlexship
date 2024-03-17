<script>
    export let size;
    export let offsetX = 0;
    export let offsetY = 0;
    export let highlighted = [];
</script>

<!-- TODO highlight the confirmed target squares (see figma Battleship (2012)) -->

<g>
    <!-- Grid lines -->
    <g>
        {#each { length: size + 1 } as _, i}
            <line
                x1={offsetX + i}
                y1={offsetY}
                x2={offsetX + i}
                y2={offsetY + size}
                stroke="white"
                stroke-width="0.06"
            />

            <line
                x1={offsetX}
                y1={offsetY + i}
                x2={offsetX + size}
                y2={offsetY + i}
                stroke="white"
                stroke-width="0.06"
            />
        {/each}
    </g>

    <!-- Highlighted squares -->
    {#each highlighted as { x, y }}
        <rect
            x={offsetX + x}
            y={offsetY + y}
            width="1"
            height="1"
            fill="none"
            stroke="red"
            stroke-width="0.06"
        />
    {/each}

    <!-- Grid numbers -->
    <g>
        {#each { length: size } as _, number}
            <text
                x={offsetX + number + 0.5}
                y={offsetY - 0.5}
                font-size="0.4"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="white"
            >
                {String.fromCharCode(65 + number + (offsetX === 0 ? 0 : size))}
            </text>

            <text
                x={offsetX - 0.5}
                y={offsetY + number + 0.5}
                font-size="0.4"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="white"
            >
                {number}
            </text>
        {/each}
    </g>
</g>
