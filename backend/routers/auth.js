import express from 'express';
import passport from "passport";
import { self, login, register } from '../controllers/index.js';
import { needsUsernameAndPassword } from '../middleware/index.js';

export const router = express.Router();


router.route('/self')
    .get(passport.authenticate("jwt", { session: false }), self);

router.route('/login')
    .post(needsUsernameAndPassword, login);

router.route('/register')
    .post(needsUsernameAndPassword, register);
