import { defineConfig } from 'cypress';
import { plugins } from './cypress/plugins/index.js';

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            return plugins(on, config);
        },
        baseUrl: 'http://127.0.0.1:3000',
    },
});