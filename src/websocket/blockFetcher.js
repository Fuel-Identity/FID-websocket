import { Worker } from 'worker_threads';
import { getLatestBlocksCursor, saveTx, saveTxAssets, saveWallets } from './functions.js';
import logger from '../logger/index.js';

const workerState = {
    maxWorkers: 3,
    currentWorkers: 0,
}

const autoState = {
    newBlock: null,
    currBlock: null
}

const log = logger()

async function workBlock({ block, auto = false, attempt = 0 }) {
    const currentAttempt = attempt + 1
    return new Promise((resolve, reject) => {
        const worker = new Worker('./src/websocket/blockWorker.js', {
            workerData: +block,
        })

        worker.on('message', (txs) => {
            handleTxs(block, txs)
        });

        worker.on('error', (code) => {
            if (code instanceof TypeError) {
                reject(new TypeError(`Error while fetching block ${block}`))
            }

            if (code !== 0) {
                workerState.currentWorkers--
                reject(new Error(`Worker stopped with exit code ${code}`));

            }
        });

        worker.on('exit', (code) => {
            workerState.currentWorkers--
            if (code !== 0)
                reject(new Error(`Worker exited with exit code ${code}`));
            resolve()
        });
    })
        .then(() => {
            log.info({ block }, `New block handled`)
        })
        .catch((err) => {
            // network error (we got type error bc we cant handle null object)
            if (err instanceof TypeError) {
                if (auto) {
                    log.warn({ block }, 'Retring working block');
                    workBlock({ block, auto: true })
                    return
                }

                if (currentAttempt >= 3) {
                    log.error('Block worker error (3 times retry) Check Network connection')
                    throw new Error('Block worker error (3 times retry) Check Network connection')
                }
                
                log.warn({ block }, 'Retring working block');
                workBlock({ block, attempt: currentAttempt })
                return
            }

            log.error({ error: err }, 'Block worker error')
        })

};

async function handleAuto({ start = null, current }) {
    if (start) {
        log.info('Starting the auto mode')
        workBlock({ block: start })
        handleAuto({ current: start })
        return
    }


    getLatestBlocksCursor().then((last) => {
        autoState.newBlock = parseInt(last)
        autoState.currBlock = parseInt(current)

        const { currBlock, newBlock } = autoState;
        // Not new
        if (currBlock == newBlock) {
            setTimeout(() => {
                handleAuto({ current })
            }, 500);
            return
        }
        // new block
        if (currBlock < newBlock) {
            workBlock({ block: newBlock, auto: true })
                .then(() => handleAuto({ current: currBlock + 1 }))
            return
        }

        // on error
        handleAuto({ current: currBlock })
        return
    })
}

// allow only { maxWorkers } to work at the same time 
async function handleblock({ block }) {
    return new Promise((resolve, reject) => {
        if (workerState.currentWorkers < workerState.maxWorkers) {
            workerState.currentWorkers++
            workBlock({ block })
            resolve()
        }
        reject(new Error('Worker pool full'))
    })
        .catch(() => {
            setTimeout(() => {
                handleblock({ block })
            }, 2000);
        })
}

function handleTxs(block, txs) {
    txs.forEach(tx => {
        saveWallets(tx)
        saveTx(block, tx);
        saveTxAssets(tx)
    })
}


export async function blockfetcher({ block, auto = false }) {
    if (auto) {
        const startCursor = parseInt(await getLatestBlocksCursor())
        handleAuto({ start: startCursor })
        return
    }

    const start = 1148379
    const end = start + 10
    for (let block = start; block < end; block++) {
        await handleblock({ block })
    } return


}

