import { parentPort, workerData } from 'node:worker_threads';
import { getTxFromBlock } from './functions.js';
import fetchTx from './txFetcher.js'

const block = workerData;
const txs = fetchTx(
    await getTxFromBlock(block)
        .then(async res => await res.json())
        .then(res => res.data.block.transactions)
);

parentPort.postMessage(txs)
process.exit(0);