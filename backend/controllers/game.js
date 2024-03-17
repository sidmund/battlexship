import {
    getUser,
    getOutgoingRequests,
    getIncomingRequests,
    insertMatchRequest,
    updateRequest,
    getShips as getShipsData,
    getMessages as getMessagesData,
    insertMessage,
} from '../models/index.js';


export const getRequests = (req, res) => {
    const user = getUser(req.params.username);
    const outgoing = getOutgoingRequests(user.id);
    const incoming = getIncomingRequests(user.id);
    return res.status(200).json({ outgoing, incoming });
};

export const requestMatch = (req, res) => {
    const player = getUser(req.params.player);
    const opponent = getUser(req.params.opponent);
    const changes = insertMatchRequest(player.id, opponent.id);
    return changes === 0
        ? res.status(404).json({ error: "Players not found" })
        : res.status(201).json({});
};

export const acceptRequest = (req, res) => {
    const id = req.params.id;
    const changes = updateRequest(id, 1);
    return changes > 0
        ? res.status(204).json({})
        : res.status(404).json({ error: "Request not found" });
};

export const refuseRequest = (req, res) => {
    const id = req.params.id;
    const changes = updateRequest(id, 2);
    return changes > 0
        ? res.status(204).json({})
        : res.status(404).json({ error: "Request not found" });
};

export const getShips = (req, res) => {
    const ships = getShipsData();
    return res.status(200).json({ ships });
}

export const getMessages = (req, res) => {
    const messages = getMessagesData();
    return res.status(200).json({ messages });
};

export const postMessage = (req, res) => {
    const changes = insertMessage(req.user.id, req.body.content);
    return changes === 0
        ? res.status(404).json({ error: "User not found" })
        : res.status(201).json({});
}
