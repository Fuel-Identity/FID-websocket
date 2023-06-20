import express from 'express';
import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { blockfetcher } from './src/websocket/blockfetcher.js';
import { initDb } from './src/db/sequelize.js';
import logger from './src/logger/index.js';

const app = express();
const server = createServer(app);
const log = logger()

const wss = new WebSocketServer({ server });
const port = process.env.PORT || 8080

await initDb().catch((message) => {
  log.error({ name: message.name }, 'Error while connecting the database')
  process.exit(0);
})

blockfetcher({blocks: null, auto: true});

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


