# Battle × Ship

A re-interpretation of a classic game.
"Battle × Ship" is a two-player multiplayer game.

Features:
- Express + Socket.IO + Passport backend with solid authentication
- Singleplayer mode (does not need login) currently only features initial ship placement/rotation and firing a single shot
- Lobby (login):
    - Robust player connectivity and handling
    - Queueing: a new game is started between random queued players, but currently offers little gameplay
    - Global chat
- Offline functionality and persistent user logins


## Server setup

Provide these environment variables in `backend/.env`:

| Environment Variable    | Default Value | Required   |
|-------------------------|---------------|------------|
| JWT_SECRET              |               | Yes        |
| JWT_LIFETIME            |               | Yes        |
| HOST                    | 0.0.0.0       | No         |
| PORT                    | 3000          | No         |
| DB                      | db/sqlite3.db | No         |
| ALLOW_RESET_DATABASE    | false         | No         |

Then run:

```bash
cd backend
npm install
npm start
```


## Client setup

Provide these environment variables in `frontend/.env`:

| Environment Variable    | Default Value       | Required   | Description                 |
|-------------------------|---------------------|------------|-----------------------------|
| VITE_SERVER_URL         |                     | Yes        | The base url of the server. |
| VITE_APP_CACHE_NAME     |                     | Yes        | The service worker cache.   |

Then run:

```bash
cd frontend
npm install
npm run dev
```

The default "admin" and "user" users can be used to quickly log in.


## Testing

API test:
```bash
cd backend
npm test
```

E2E test:
```bash
cd backend
npm run e2e

# other terminal
cd frontend
npm run dev

# other terminal
cd frontend
npx cypress open
```