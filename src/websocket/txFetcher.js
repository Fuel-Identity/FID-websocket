export function fetchTransactions(txs) {
    const fetchedTx = [];

    txs.forEach(({ id, status, inputs, outputs }) => {

        const txData = {
            id: null,
            from: null,
            to: null,
            receivedAssets: [],
            sendedAssets: [],
        }

        if (status.__typename === 'SuccessStatus') { // keep only successfull tx
            if (inputs) {
                txData.id = id;
                inputs.forEach(
                    ({
                        contract,
                        owner,
                        messageId,
                        sender,
                        recipient,
                        amount
                    }) => {

                        // InputCoin
                        if (owner && amount > 0) {
                            txData.from = owner
                            txData.sendedAssets.push({
                                amount,
                                assetId
                            })
                        }

                        // InputContract
                        if (contract) {
                            txData.to = contract.id
                        }

                        // Input message
                        if (messageId) {
                            txData.from = sender
                            txData.to = recipient
                            txData.sendedAssets.push({ amount })
                            console.log('message: ', messageId);
                        }

                    });
            } else return // we dont keep the first tx of a block (always null)

            if (outputs) {

                const coinOutputs = ['CoinOutput', 'ChangeOutput', 'VariableOutput']
                outputs.forEach(
                    ({
                        to,
                        amount,
                        assetId,
                        __typename,
                        contract
                    }) => {

                        // InputCoin
                        if (coinOutputs.includes(__typename) && amount > 0) {
                            txData.from = to
                            txData.receivedAssets.push({
                                amount,
                                assetId
                            })
                        }

                        // Contract creation
                        if (contract) {
                            console.log('contract created: ', contract.id);
                        }


                    });
            }
            fetchedTx.push(txData);
        }
    });

    return fetchedTx;
}

