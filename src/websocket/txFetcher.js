export default function fetchTransactions(txs) {
    const fetchedTx = [];

    txs.forEach(({ id, status, inputs, outputs }) => {

        const txData = {
            id: null,
            from: null,
            to: null,
            assetsInput: [],
            assetsOutputs: [],
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
                        amount,
                        assetId
                    }) => {

                        // InputCoin
                        if (owner) {
                            txData.from = owner;
                            txData.assetsInput.push({
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
                            txData.assetsInput.push({ amount })
                            console.log('message: ', messageId);
                        }

                    });
            } else return // we dont keep the first tx of a block (always null)

            if (outputs) {

                outputs.forEach(
                    ({
                        to,
                        amount,
                        assetId,
                        contract
                    }) => {

                        // InputCoin
                        if (to) {
                            if(to != txData.from) txData.to = to;

                            // special case: user send himself coins
                            if(!txData.to) txData.to = to

                            txData.assetsOutputs.push({
                                amount,
                                assetId
                            });

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

