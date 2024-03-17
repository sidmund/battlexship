import express from 'express';
import {
    getRequests,
    requestMatch,
    acceptRequest,
    refuseRequest,
    getShips,
    getMessages,
    postMessage,
} from '../controllers/index.js';
import { authenticate, selfOrAdmin } from '../middleware/index.js';

export const router = express.Router();

router.route('/chat')
    .get(authenticate, getMessages)
    .post(authenticate, selfOrAdmin, postMessage);

router.route('/requests/:username')
    .get(authenticate, selfOrAdmin, getRequests);
router.route('/requests/:player/:opponent')
    .post(authenticate, selfOrAdmin, requestMatch);
router.route('/requests/:id/accept')
    .put(authenticate, selfOrAdmin, acceptRequest);
router.route('/requests/:id/refuse')
    .put(authenticate, selfOrAdmin, refuseRequest);

router.route('/ships')
    .get(getShips);
