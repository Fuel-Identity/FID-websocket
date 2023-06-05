import express from 'express';
import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { blockfetcher, targetedBlocks } from './src/websocket/blockfetcher.js';

const app = express();
const server = createServer(app);

const wss = new WebSocketServer({ server });
const port = process.env.PORT || 8080

blockfetcher({blocks: targetedBlocks})


wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  ws.send('Connected');
});

//start our server
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


app.get('/', (req, res) => {
  res.json('Hello, fuelID websocket is ready to use !')
})


