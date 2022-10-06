import { useCallback, useEffect, useReducer, useState } from "react"
import { getStarknet, web3 } from '../../libs';
import { StoredTransactionsState, TransactionState } from "./model"
import { EthTransactionContext } from "./transaction-context"
import { transactionsReducer } from "./transaction-reducer"
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useBlockEth } from "../EthBlockProvider";
import { useStandardERCBridgeContract } from "../../contracts/StandardERCBridge";
interface TransactionProviderProps {
    children: React.ReactNode
}
const EthTransactionProvider = ({ children }: TransactionProviderProps): JSX.Element => {
    const { blockNumberEth } = useBlockEth()
    const [transactionsL1, dispatch] = useReducer(transactionsReducer, [])
    const { isWithdrawable } = useStandardERCBridgeContract()
    const syncStoreTransactions = (localTransactions: TransactionState[]) => {
        dispatch({
            type: 'UPDATE_TRANSACTIONS',
            payload: localTransactions,
        })
    }
    const addTransactionL1 = useCallback(
        (
            payload: any,
            description: string,
            date: string,
            successCallback: () => void,
            errorCallback: () => void
        ) => {
            dispatch({
                type: 'ADD_TRANSACTION',
                payload,
                description,
                date,
                successCallback,
                errorCallback,
            })
        },
        [dispatch]
    )


    const processTransactionEnd = (tx: TransactionState) => {
        if (tx.code) {
            if (tx.successCallback) tx.successCallback()

            return {
                ...tx,
                successCallback: undefined,
                errorCallback: undefined,
            }
        }
        return undefined
    }


    const checkAndUpdateTransaction = async (tx: TransactionState, newBlockNumber: number) => {
        const txEndedResponse = processTransactionEnd(tx)
        if (txEndedResponse) return txEndedResponse
        if (tx.lastCalled === newBlockNumber) {
            return tx
        }

        try {
            // get the new status of the tx
            const newStatus = await web3.eth.getTransactionReceipt(tx.txHash)
            // Update & return the transaction
            const newTransaction: TransactionState = {
                ...tx,
                code: newStatus.status,
                lastCalled: newBlockNumber,
            }

            return newTransaction
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`failed to check transaction status: ${tx.txHash}`)
        }

        return tx
    }

    useDeepCompareEffect(() => {
        const process = async () => {
            // If block hash is undefined, stop process
            if (!blockNumberEth || transactionsL1.length === 0) {
                return
            }

            // Filter by unique tx hash
            const filteredTxs = transactionsL1.filter(
                (tx: TransactionState, index, self) =>
                    index === self.findIndex((txTemp) => txTemp.txHash === tx.txHash)
            )
            const promises: Promise<TransactionState>[] = []
            filteredTxs.forEach((tx) => promises.push(checkAndUpdateTransaction(tx, blockNumberEth)))
            Promise.all(promises).then((newTransactions: TransactionState[]) => {
                // Re-sync the store & the localstorage
                syncStoreTransactions(newTransactions)
            })
        }
        process()
    }, [blockNumberEth, transactionsL1])
    return (
        <EthTransactionContext.Provider
            value={{ transactionsL1, addTransactionL1 }}
            // eslint-disable-next-line react/no-children-prop
            children={children}
        />
    )
}

export default EthTransactionProvider
