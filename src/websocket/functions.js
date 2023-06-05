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
          query: "query BlockTransactionsPageQuery($height: U64) {\n  block(height: $height) {\n    id\n    header {\n      height\n      time\n      __typename\n    }\n    transactions {\n      ...BlockTransactionFragment\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment BlockTransactionFragment on Transaction {\n  id\n  inputContracts {\n    id\n    __typename\n  }\n  inputAssetIds\n  gasPrice\n  gasLimit\n  maturity\n  isScript\n  isCreate\n  isMint\n  receiptsRoot\n  witnesses\n  outputs {\n    __typename\n    ... on CoinOutput {\n      to\n      amount\n      assetId\n      __typename\n    }\n    ... on ContractOutput {\n      inputIndex\n      balanceRoot\n      stateRoot\n      __typename\n    }\n    ... on ChangeOutput {\n      to\n      amount\n      assetId\n      __typename\n    }\n    ... on VariableOutput {\n      to\n      amount\n      assetId\n      __typename\n    }\n    ... on ContractCreated {\n      contract {\n        id\n        __typename\n      }\n      __typename\n    }\n  }\n  inputs {\n    __typename\n    ... on InputCoin {\n      owner\n      __typename\n    }\n    ... on InputContract {\n      contract {\n        id\n        __typename\n      }\n      __typename\n    }\n  }\n  status {\n    ... on SubmittedStatus {\n      time\n      __typename\n    }\n    ... on SuccessStatus {\n      time\n      __typename\n    }\n    ... on FailureStatus {\n      time\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n"
        })
      })
      .catch(err => console.error(err))
      .then(res => res.json())
      .then(res => res.data.block.transactions)
  }