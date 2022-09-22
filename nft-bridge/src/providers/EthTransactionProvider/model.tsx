import { GetTransactionReceiptResponse, GetTransactionResponse, InvokeFunctionResponse, Status } from "starknet"

export interface TransactionState {
    txHash?: string
    lastCalled?: number
    code?: boolean
    date?: string
    successCallback?: () => void
    errorCallback?: () => void
}
export type StoredTransactionsState = TransactionState[]
export const TRANSACTION_STATE_INITIAL_STATE: TransactionProviderState = {
    transactionsL1: [],
    addTransactionL1: (tx) => undefined,
}



export interface TransactionProviderState {
    transactionsL1: StoredTransactionsState,
    addTransactionL1: (
        payload: any,
        description: string,
        date: string,
        successCallback: () => void,
        errorCallback: () => void
    ) => void
}

