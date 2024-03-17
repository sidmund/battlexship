export const plugins = (on, config) => {
    // To be able to view `cy.log` output in headless mode
    on("task", {
        log(args) {
            console.log(...args);
            return null;
        }
    });
};
