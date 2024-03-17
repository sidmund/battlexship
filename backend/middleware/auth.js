import passport from "passport";

// MANUAL
// export const authenticate = (req, res, next) => {
//     const auth = req.headers.authorization;
//     if (!auth || !(auth.startsWith('Bearer ') || auth.startsWith('bearer '))) {
//         return res.status(401).json({ error: "No token present" });
//     }

//     const token = auth.split(' ')[1];
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             console.error(err.message);
//             return res.status(401).json({ error: "Unauthorized" });
//         }

//         req.user = {
//             id: decoded.id,
//             username: decoded.username,
//             level: decoded.level,
//             rank: decoded.rank,
//             credits: decoded.credits,
//         };
//         next();
//     });
// };

export const authenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        // TODO fix authApi tests to work with this instead
        if (err || !user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        console.log(`Authenticated: ${user}, ${JSON.parse(user)}`);
        req.user = user;
        next();
    })(req, res, next);
};

export const atLeastLevel = (level) => {
    return function (req, res, next) {
        if (req.user.level < level) {
            return res.status(403).json({ error: "Insufficient permissions" });
        }
        next();
    };
};

// Requests taking a username that only permit the user themselves (or an admin)
export const selfOrAdmin = (req, res, next) => {
    // Must be admin to affect other users
    if (req.user.username !== req.params.username && req.user.level < 2) {
        return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
};

export const needsUsernameAndPassword = (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ error: "Missing username or password" });
    }
    next();
};
