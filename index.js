import express from 'express';
import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { blockfetcher } from './src/websocket/blockfetcher.js';
import { initDb } from './src/db/sequelize.js';
import { getLatestBlocksCursor } from './src/websocket/functions.js';
import logger from './src/logger/index.js';

const app = express();
const server = createServer(app);
const log = logger()

const wss = new WebSocketServer({ server });
const port = process.env.PORT || 8080

await initDb();

// const lastCursor = await getLatestBlocksCursor();

blockfetcher({blocks: null, auto: true});

const blocks = [
  100718,
]
//blockfetcher({ block: 100718 });


wss.on('connection', (ws) => {
  ws.send('Connected');
});

//start our server
server.listen(port, () => {
  log.info({ port }, `Server started`);
});


app.get('/', (req, res) => {
  res.json('Hello, fuelID websocket is ready to use !')
})


