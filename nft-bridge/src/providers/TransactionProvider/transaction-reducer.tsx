import { GetTransactionReceiptResponse, GetTransactionResponse, Status } from 'starknet'
import { StoredTransactionsState, TransactionState } from './model'

interface AddTransaction {
    type: 'ADD_TRANSACTION'
    payload: GetTransactionReceiptResponse
    description: string,
    date: string,
    successCallback: () => void
    errorCallback: () => void
}

interface UpdateTransactions {
    type: 'UPDATE_TRANSACTIONS'
    payload: TransactionState[]
}

type Action = AddTransaction | UpdateTransactions
export const transactionsReducer = (
    state: StoredTransactionsState,
    action: Action
): StoredTransactionsState => {
    switch (action.type) {
        case 'ADD_TRANSACTION': {
            const storedTx = {
                txHash: action.payload.transaction_hash,
                code: 'NOT_RECEIVED' as Status,
                description: action.description,
                date: action.date,
                lastChecked: '',
                successCallback: action.successCallback,
                errorCallback: action.errorCallback,
            }
            return [...state, storedTx]
        }
        case 'UPDATE_TRANSACTIONS': {
            return action.payload
        }
        default: {
            return state
        }
    }

}
