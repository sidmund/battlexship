/// <reference types='cypress' />

describe.skip('Examples', () => {
	it('server is running', () => {
		cy.request({
			url: '/',
		}).then(res => {
			expect(res).property('body').property('success').to.equal(true);
		});
	});
});
