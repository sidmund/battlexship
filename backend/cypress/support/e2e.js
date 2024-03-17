beforeEach(() => {
	cy.request({ method: 'PUT', url: '/reset_database' });
});

let tokenCache = {}; // speed up testing

// This adds a `userRequest` method to the Cypress `cy` object, for easy use
// in your tests.
// `userPassword`: User name and password, separated by a ':'. If no ':' was given,
//                 the password will be the same as the user name.
// `obj`: A Cypress request object or request path string.
Cypress.Commands.add("userRequest", (userPassword, obj) => {
	let [username, password] = userPassword.split(':');
	// Assume the password is the same as the user name, if unspecified
	if (password == null) password = username;

	const key = `${username}:${password}`;
	if (tokenCache[key]) return run();

	return cy.request({
		method: 'POST',
		url: '/auth/login',
		body: { username, password },
	}).its('body').then((body) => {
		tokenCache[key] = body.token;
		return run();
	});

	function run() {
		// If `obj` is actual a URL, convert it into a request object.
		if (typeof obj === 'string') obj = { url: obj };

		// Make sure `headers` exists on `obj`.
		obj.headers = obj.headers || {};
		obj.headers.authorization = `bearer ${tokenCache[key]}`;

		return cy.request(obj);
	}
});

// To be able to view `cy.log` output in headless mode
Cypress.Commands.overwrite("log", function (log, ...args) {
	if (Cypress.browser.isHeadless) {
		return cy.task("log", args, { log: false }).then(() => {
			return log(...args);
		});
	} else {
		console.log(...args);
		return log(...args);
	}
});