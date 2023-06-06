import express from 'express';
import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { blockfetcher } from './src/websocket/blockfetcher.js';
import { initDb } from './src/db/sequelize.js';

const app = express();
const server = createServer(app);

const wss = new WebSocketServer({ server });
const port = process.env.PORT || 8080

initDb();

function generateBlocks(startHeight, number) {
  const blocks = []
  for (let index = 0; index < number; index++) {
      blocks.push(startHeight + index);
  } return blocks;
} 

const targetedBlocks = generateBlocks(888888, 10);

blockfetcher({blocks: targetedBlocks});


wss.on('connection', (ws) => {
  ws.send('Connected');
});

//start our server
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


app.get('/', (req, res) => {
  res.json('Hello, fuelID websocket is ready to use !')
})


