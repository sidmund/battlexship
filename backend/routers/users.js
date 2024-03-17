import express from 'express';
import { getUsers, getUser, deleteUser } from '../controllers/index.js';
import { authenticate, selfOrAdmin } from '../middleware/index.js';

export const router = express.Router();

router.route('/')
    .get(authenticate, getUsers);

router.route('/:username')
    .get(authenticate, getUser)
    .delete(authenticate, selfOrAdmin, deleteUser);
