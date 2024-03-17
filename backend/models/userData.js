import db from '../index.js';


export const insertUser = (user) => {
    let result = db.prepare('INSERT INTO account (username, bcryptPassword, level) VALUES ($username, $bcryptPassword, $level)').run(user);
    return result.changes;
}

export const getUsers = () => {
    return db.prepare('SELECT * FROM account').all();
}

export const getUser = (username) => {
    return db.prepare('SELECT * FROM account WHERE username = ?').get(username);
}

export const deleteUser = (username) => {
    let result = db.prepare('DELETE FROM account WHERE username = ?').run(username);
    return result.changes;
}
