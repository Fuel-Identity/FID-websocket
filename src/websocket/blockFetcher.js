import { getTxFromBlock } from "./functions.js";
import { fetchTransactions } from "./txFetcher.js";
import { Transaction, Wallet, TxAsset } from "../db/sequelize.js";

function saveWallets({ from, to }) {
    const wallets = [from, to];
    wallets.forEach(wallet => Wallet.create({ address: wallet }).then(() => console.log('Wallet saved')));
}

function saveTxAssets({ id, assetsInput, assetsOutputs }) {
    assetsInput.forEach(({ amount, assetId}) => {
        TxAsset.create({
            amount: amount,
            currency: assetId,
            TxHash: id
        })
    });

    assetsOutputs.forEach(({ amount, assetId}) => {
        TxAsset.create({
            amount: amount,
            currency: assetId,
            TxHash: id
        })
    })
}

function saveTx(block, { id, from, to, assetsInput, assetsOutputs }) {
    Transaction.create({
        txHash: id, 
        blockHeight: block,
        from, 
        to
    }).then(() => console.log('Tx saved'));
}

export function blockfetcher({ blocks }) {
    blocks.forEach(async block => {
       const txs = await fetchTransactions(await getTxFromBlock(block));
       txs.forEach((tx) => {  
            saveWallets(tx);
            saveTx(block, tx);
            saveTxAssets(tx);
       })
    });
}

