import { getTxFromBlock } from "./functions.js";
import { fetchTransactions } from "./txFetcher.js";

export const targetedBlocks = [
    906707,
    906708,
    906709,
    906710,
    906711,
    906712,
    906713,
    906714
]

export function blockfetcher({ blocks }) {
    blocks.forEach(async block => {
       const txs = await fetchTransactions(await getTxFromBlock(block));
       txs.forEach(({ id, from, to, assetsInput, assetsOutputs }) => {
        console.log({
            id,
            block,
            from,
            to,
            assetsInput,
            assetsOutputs
           });
       })
    });
}

