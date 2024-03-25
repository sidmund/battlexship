/// <reference types='cypress' />

import users from '../fixtures/users.json';


function shouldError(method, url, body, expectedStatus) {
    cy.request({ method, url, body, failOnStatusCode: false }).then(res => {
        expect(res.status).to.equal(expectedStatus);
        expect(res).property('body').to.have.property('error');
    });
}

function userRequestShouldError(usernamePassword, method, url, body, expectedStatus) {
    cy.userRequest(usernamePassword, { method, url, body, failOnStatusCode: false }).then(res => {
        expect(res.status).to.equal(expectedStatus);
        expect(res).property('body').to.have.property('error');
    });
}

function shouldReturnToken(url, body, expectedStatus) {
    cy.request({ method: 'POST', url, body }).then(res => {
        expect(res.status).to.equal(expectedStatus);
        expect(res.body).to.have.property('token');
    });
}


describe('Logging in', () => {
    it('can login existing user', () => {
        shouldReturnToken('/auth/login', users.admin, 200);
    });

    it('fails login on non-existing user', () => {
        shouldError('POST', '/auth/login', users.nonExistingUser, 401);
    });

    it('fails login on existing user but wrong password', () => {
        shouldError('POST', '/auth/login', users.adminWrongPw, 401);
    });

    it('fails login when password or username is missing', () => {
        for (const incomplete in users.missingDetails) {
            shouldError('POST', '/auth/login', incomplete, 400);
        }
    });
});

describe('Registration', () => {
    it('can register new user', () => {
        shouldReturnToken('/auth/register', users.newUser, 201);
    });

    it('fails to register new user with existing username', () => {
        shouldError('POST', '/auth/register', users.newUserFail, 400);
    });

    it('fails to register when password or username is missing', () => {
        for (const incomplete in users.missingDetails) {
            shouldError('POST', '/auth/register', incomplete, 400);
        }
    });
});

describe('Users', () => {
    context('not logged in', () => {
        it('fails to get all users', () => {
            shouldError('GET', '/users', {}, 401);
        });

        it('fails to get a user', () => {
            shouldError('GET', '/users/admin', {}, 401);
        });

        it('fails to get a non-existant user', () => {
            shouldError('GET', '/users/superman', {}, 401);
        });

        it('fails to get all users with invalid token', () => {
            cy.request({
                url: '/users', failOnStatusCode: false, headers: {
                    authorization: 'bearer my-token',
                }
            }).then(res => {
                expect(res.status).to.equal(401);
                expect(res).property('body').to.have.property('error');
            });
        });

        it('fails to delete a user', () => {
            shouldError('DELETE', '/users/admin', {}, 401);
        });
    });

    context('logged in', () => {
        it('can get all users', () => {
            cy.userRequest('user', { url: '/users' }).then(res => {
                expect(res.status).to.equal(200);
                expect(res).property('body').to.have.property('users');
                expect(res.body.users).to.have.lengthOf(2);
                cy.log(res.body.users);
            });
        });

        it('can get a user', () => {
            cy.userRequest('user', { url: '/users/admin' }).then(res => {
                expect(res.status).to.equal(200);
                expect(res).property('body').to.have.property('user');
                cy.log(res.body.user);
            });
        });

        it('fails to get non-existing user', () => {
            userRequestShouldError('user', 'GET', '/users/superman', {}, 404);
        });

        it('can delete myself', () => {
            cy.userRequest('user', { method: 'DELETE', url: '/users/user' }).then(res => {
                expect(res.status).to.equal(204);
                // TODO make another DELETE request or try to get the user, to confirm they were deleted
                // TODO also make sure you check the *persistence* of other test responses too
            });
        });

        it('fail to delete other user when not admin', () => {
            userRequestShouldError('user', 'DELETE', '/users/admin', {}, 403);
        });

        it('admin cannot delete non-existent user', () => {
            userRequestShouldError('admin', 'DELETE', '/users/superman', {}, 404);
        });

        it('admin can delete other user', () => {
            cy.userRequest('admin', { method: 'DELETE', url: '/users/user' }).then(res => {
                expect(res.status).to.equal(204);
            });
        });
    });
});