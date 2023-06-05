import { getTxFromBlock } from "./functions.js";
import { fetchTransactions } from "./txFetcher.js";

export const targetedBlocks = [
    906668,
    906669,
    906700,
    906701,
    906702,
    906703,
    906704,
    906705,
    906706,
    906707,
    906708,
]

export function blockfetcher({ blocks }) {
    blocks.forEach(async block => {
        const txs = await getTxFromBlock(block);
        console.log(fetchTransactions(txs));
    });
}

