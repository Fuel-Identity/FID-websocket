import logger from '../logger/index.js'
import { Transaction, TxAsset, Wallet } from '../db/sequelize.js';

const log = logger()

const LATEST_BLOCKS_QUERY = `query LatestBlocks {
  blocks(last: 1) {
    edges {
      cursor
    }
  }
}
`;

export async function getTxFromBlock(height) {
  return await fetch('https://beta-3.fuel.network/graphql',
    {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        operationName: "BlockTransactionsPageQuery",
        variables: {
          height: height.toString()
        },
        query: "query BlockTransactionsPageQuery($height: U64) {\n  block(height: $height) {\n    id\n    header {\n      height\n      time\n      __typename\n    }\n    transactions {\n      ...BlockTransactionFragment\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment BlockTransactionFragment on Transaction {\n  id\n  inputContracts {\n    id\n    __typename\n  }\n  inputAssetIds\n  gasPrice\n  gasLimit\n  maturity\n  isScript\n  isCreate\n  isMint\n  receiptsRoot\n  witnesses\n  outputs {\n    __typename\n    ... on CoinOutput {\n      to\n      amount\n      assetId\n      __typename\n    }\n    ... on ContractOutput {\n      inputIndex\n      balanceRoot\n      stateRoot\n      __typename\n    }\n    ... on ChangeOutput {\n      to\n      amount\n      assetId\n      __typename\n    }\n    ... on VariableOutput {\n      to\n      amount\n      assetId\n      __typename\n    }\n    ... on ContractCreated {\n      contract {\n        id\n        __typename\n      }\n      __typename\n    }\n  }\n  inputs {\n    __typename\n    ... on InputCoin {\n      utxoId\n      owner\n      __typename\n     amount\n      assetId\n     }\n    ... on InputContract {\n      contract {\n        id\n        __typename\n      }\n      __typename\n    }\n  }\n  status {\n    ... on SubmittedStatus {\n      time\n      __typename\n    }\n    ... on SuccessStatus {\n      time\n      __typename\n    }\n    ... on FailureStatus {\n      time\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n"
      })
    })
}

export const getLatestBlocksCursor = async () => {
  const response = await fetch("https://beta-3.fuel.network/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: LATEST_BLOCKS_QUERY,
    }),
  });
  const json = await response.json();
  return json.data.blocks.edges[0].cursor;
};

export function saveWallets({ from, to }) {
    const wallets = [from, to];
    wallets.forEach(wallet => {
        try {
            Wallet.create({ address: wallet })
              .catch(err => {
                log.debug({ 
                  type: err.type, 
                  message: err.message, 
                  wallet,
                }, 'Wallet saving error')
              })
        } catch (error) {
            console.log(error);
        }
    });
}

export function saveTxAssets({ id, assetsInput, assetsOutputs }) {
    assetsInput.forEach(({ amount, assetId }) => {
        try {
            TxAsset.create({
                amount: amount,
                currency: assetId,
                TxHash: id
            })
        } catch (error) {
            console.log(error);
        }
    });

    assetsOutputs.forEach(({ amount, assetId }) => {
        try {
            TxAsset.create({
                amount: amount,
                currency: assetId,
                TxHash: id
            })
        } catch (error) {
            console.log(error);
        }
    })
}

export function saveTx(block, { id, from, to }) {
  Transaction.create({
      txHash: id,
      blockHeight: block,
      from,
      to
  }).catch((err) => {
    console.log(`On : ${block} ${ id, from, to }`);
    console.log(err);
  })
}