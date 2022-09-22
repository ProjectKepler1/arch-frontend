import { useCallback, useEffect, useReducer, useState } from "react"
import { GetTransactionReceiptResponse, GetTransactionResponse, InvokeFunctionResponse } from "starknet"
import { useBlock } from "../BlockProvider"
import { getStarknet, web3 } from '../../libs';
import { StoredTransactionsState, TransactionState } from "./model"
import { TransactionContext } from "./transaction-context"
import { transactionsReducer } from "./transaction-reducer"
import useDeepCompareEffect from 'use-deep-compare-effect'
interface TransactionProviderProps {
    children: React.ReactNode
}
const TransactionProvider = ({ children }: TransactionProviderProps): JSX.Element => {
    const { blockNumber, blockHash } = useBlock()
    const [transactionsL2, dispatch] = useReducer(transactionsReducer, [])

    const account = getStarknet().account
    const syncStoreTransactions = (localTransactions: TransactionState[]) => {
        dispatch({
            type: 'UPDATE_TRANSACTIONS',
            payload: localTransactions,
        })
    }
    const addTransaction = useCallback(
        (
            payload: GetTransactionReceiptResponse,
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
        if ((tx.code === 'ACCEPTED_ON_L1' && tx.description === "INITIATE_WITHDRAW") || (tx.code === 'ACCEPTED_ON_L2' && (tx.description === "MINTER_ROLE" || tx.description === "BURNER_ROLE"))) {
            if (tx.successCallback) tx.successCallback()

            return {
                ...tx,
                successCallback: undefined,
                errorCallback: undefined,
            }
        }
        if (tx.code === 'REJECTED') {
            if (tx.errorCallback) tx.errorCallback()

            return {
                ...tx,
                successCallback: undefined,
                errorCallback: undefined,
            }
        }
        return undefined
    }


    const checkAndUpdateTransaction = async (tx: TransactionState, newBlockNumber: number,) => {
        const txEndedResponse = processTransactionEnd(tx)
        if (txEndedResponse) return txEndedResponse
        if (tx.lastCalled === newBlockNumber && tx.code !== 'NOT_RECEIVED') {
            return tx
        }

        try {
            // get the new status of the tx
            const newStatus = await getStarknet().account.getTransactionReceipt(tx.txHash)
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
            // console.log(blockNumber, transactionsL2)
            // If block hash is undefined, stop process
            if (!blockNumber || !account || transactionsL2.length === 0) {
                return
            }

            // Filter by unique tx hash
            const filteredTxs = transactionsL2.filter(
                (tx: TransactionState, index, self) =>
                    index === self.findIndex((txTemp) => txTemp.txHash === tx.txHash)
            )
            const promises: Promise<TransactionState>[] = []
            filteredTxs.forEach((tx) => promises.push(checkAndUpdateTransaction(tx, blockNumber)))
            Promise.all(promises).then((newTransactions: TransactionState[]) => {
                // Re-sync the store & the localstorage
                syncStoreTransactions(newTransactions)
            })
        }
        process()
    }, [blockHash, transactionsL2, account])

    return (
        <TransactionContext.Provider
            value={{ transactionsL2, addTransaction }}
            // eslint-disable-next-line react/no-children-prop
            children={children}
        />
    )
}

export default TransactionProvider
