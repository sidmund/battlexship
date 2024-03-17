// Based on Joy of Code's https://www.youtube.com/watch?v=_jWnyJRKOvU

/*
Usage:
```
<script>
import { signal, animate, all } from "./lib/motion";

const sfx = {
    transition: "sfx/transition.mp3",
    tally: "sfx/tally.mp3",
};
const circle = signal({ cx: -300, cy: 0, fill: "red", r: 40 });
const text = signal({ opacity: 0 });

animate(async () => {
    // To play a single animation:
    await circle.to({ cx: 300, fill: "blue" }).to({ cx: -300 });

    // To play multiple simultaneously:
    all(
        circle.sfx(sfx.transition).to({ cx: 300, r: 80, fill: "blue" }).to({ cx: -300 }),
        text.to({ opacity: 1 }, { duration: 2000 }),
    );
});
</script>

<svg viewBox="-300 -300 600 600" width="200" height="200">
    <circle cx={$circle.cx} cy={$circle.cy} r={$circle.r} fill={$circle.fill} />
    <text
        x={$circle.cx}
        y={$circle.cy}
        opacity={$text.opacity}
        font-size={$circle.r * 0.4}
        text-anchor="middle"
        dominant-baseline="middle"
    >
        Motion
    </text>
</svg>
```
*/

import { tweened } from "svelte/motion";
import { interpolate } from "d3-interpolate"; // npm install d3
import { cubicInOut } from "svelte/easing";
import { onMount } from "svelte";


/**
 * Plays animations after mounting.
 * @param fn function that plays animations
 */
export function animate(fn) {
    // wrapper to make for a nicer API
    onMount(fn);
}


export function signal(
    values,
    options = { duration: 1000, easing: cubicInOut, interpolate },
) {
    const { subscribe, update } = tweened(values, options);

    let tasks = []; // contains functions

    /**
     * Instantly update the store with the specified values. No animation is played.
     * @param {Object} values the values to update
     */
    function now(values) {
        update((prev) => {
            return { ...prev, ...values };
        });
    }

    function getState() {
        return values;
    }

    /**
     * Animate this store to the specified values.
     * Await the returned promise, or let it run in the background.
     * @param {Object} values the values to be animated
     * @param {Object} options optional animation options
     * @returns this for chaining further animations and/or sounds
     */
    function to(values, options) {
        // push a function that will update (not yet)
        tasks.push(() =>
            update((prev) => {
                return { ...prev, ...values };
            }, options),
        );
        return this;
    }

    /**
     * Play a sound. Await the returned promise, or let it run in the background.
     * @param {string} sound path to sound effect
     * @param {Object} options optional sound options, currently only supports 'volume'
     * @returns this for chaining further animations and/or sounds
     */
    function sfx(sound, { volume = 0.5 } = {}) {
        const audio = new Audio(sound);
        audio.volume = volume;

        tasks.push(() => {
            audio.play().catch(() => {
                console.error("To play sounds interact with the page first.");
            });
        });

        return this;
    }

    // store needs to be "Thenable" so we can chain promises
    async function then(resolve) {
        for (const task of tasks) {
            await task(); // NOW call the pushed functions
        }
        resolve();
        tasks = [];
    }

    return {
        subscribe,
        now,
        getState,
        to,
        sfx,
        then,
    };
}


/**
 * Animate all provided animations simultaneously.
 * @param  {...any} animations the list of animations
 * @returns Promise
 */
export function all(...animations) {
    return Promise.all(animations);
}
