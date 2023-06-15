import { Worker } from 'worker_threads';
import { getTxFromBlock, saveTx, saveTxAssets, saveWallets } from './functions.js';
import fetchTx from './txFetcher.js'
import logger from '../logger/index.js';

const workerState = {
    maxWorkers: 3,
    currentWorkers: 0,
}

const log = logger()

function workBlock(block) {
    new Promise((resolve, reject) => {
        const worker = new Worker('./src/websocket/blockWorker.js', {
            workerData: block,
        });

        worker.on('message', (txs) => {
            handleTxs(block, txs)
        });

        worker.on('error', (code) => {
            if(code instanceof TypeError) {
                reject(new TypeError(`Error while fetching block ${block}`))
            }

            if (code !== 0) {
                workerState.currentWorkers = workerState.currentWorkers - 1
                reject(new Error(`Worker stopped with exit code ${code}`));

            }
        });

        worker.on('exit', (code) => {
            workerState.currentWorkers = workerState.currentWorkers - 1
            if (code !== 0)
                reject(new Error(`Worker exited with exit code ${code}`));
            resolve()
        });
    })
    .then(() => {
        log.info({ block }, `New block handled`)
    })
    .catch((err) => {
        if(err instanceof TypeError) {
            log.warn({ block },'Retring working block');
            workBlock(block)
            return
        } 
         
        log.error({ error: err }, 'Block worker error')
    })

};


function handleblock(block) {
    if (workerState.currentWorkers < workerState.maxWorkers) {
        workerState.currentWorkers = workerState.currentWorkers + 1
        workBlock(block)
        return
    }

    setTimeout(() => {
        handleblock(block)
    }, 500)
}

const handleTxs = (block, txs) => {
    txs.forEach(tx => {
        saveWallets(tx)
        saveTx(block, tx);
        saveTxAssets(tx)
    })
}


export async function blockfetcher({ block, auto = false }) {
    if (auto) {
        const start = 200000
        const end = start + 2000
        for (let block = start; block < end; block++) {
            handleblock(block)
        } return
    }

    const txs = fetchTx(await getTxFromBlock(block));
    console.log(txs);


}

