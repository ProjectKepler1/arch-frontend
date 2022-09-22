import { GetTransactionReceiptResponse, GetTransactionResponse, InvokeFunctionResponse, Status } from "starknet"

export interface TransactionState {
    txHash?: string
    lastCalled?: number
    code?: string
    date?: string
    description?: string
    successCallback?: () => void
    errorCallback?: () => void
}
export type StoredTransactionsState = TransactionState[]
export const TRANSACTION_STATE_INITIAL_STATE: TransactionProviderState = {
    transactionsL2: [],
    addTransaction: (tx) => undefined,
}



export interface TransactionProviderState {
    transactionsL2: StoredTransactionsState,
    addTransaction: (
        payload: GetTransactionReceiptResponse,
        description: string,
        date: string,
        successCallback: () => void,
        errorCallback: () => void
    ) => void
}

