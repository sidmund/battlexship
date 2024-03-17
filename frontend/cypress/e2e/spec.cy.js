/// <reference types='cypress' />

describe('Single player mode', () => {
    it('can fire a missile', () => {
        cy.visit('http://localhost:5173');
        cy.getByData('SinglePlayer').first().click();
        cy.get('footer button').first().click();
        cy.get('footer button').first().click();
        cy.get('line[x1="12"][y1="5"]').first().click();
        cy.getByData('missile').should('have.length', 1);
    });
});
