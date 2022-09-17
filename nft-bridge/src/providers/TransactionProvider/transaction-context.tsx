import React from 'react'

import type { TransactionState, TransactionProviderState } from './model'
import { TRANSACTION_STATE_INITIAL_STATE } from './model'

export const TransactionContext = React.createContext<TransactionProviderState>(TRANSACTION_STATE_INITIAL_STATE)

export function useTransaction() {
    return React.useContext(TransactionContext)
}
