import { jwtDecode } from "jwt-decode";

/**
 * @param {string} method the HTTP method
 * @param {string} endpoint the API endpoint
 * @param {any} data the data to send for a POST or PUT request
 * @returns {Promise<any>} the JSON response
 */
export async function api(method, endpoint, data) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Allow-Control-Allow-Origin": "*",
        },
        body: data ? JSON.stringify(data) : undefined,
    }

    return fetch(`${import.meta.env.VITE_SERVER_URL}/${endpoint}`, options);
}

export function parseJWT(token) {
    return jwtDecode(token);
}

export function emit(event, detail) {
    document.dispatchEvent(new CustomEvent(event, { detail }));
}

export function randomInt(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
}

export function random(a, b) {
    return Math.random() * (b - a) + a;
}

export function randomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
}
