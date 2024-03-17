import { getUsers as getUsersData, getUser as getUserData, deleteUser as deleteUserData } from '../models/index.js';


export const getUsers = (req, res) => {
    const users = getUsersData();
    res.status(200).json({ users });
};

export const getUser = (req, res) => {
    const user = getUserData(req.params.username);
    return user
        ? res.status(200).json({ user })
        : res.status(404).json({ error: "User not found" });
};

export const deleteUser = (req, res) => {
    const username = req.params.username;
    const changes = deleteUserData(username);
    return changes > 0
        ? res.status(204).json({})
        : res.status(404).json({ error: "User not found" });
};
