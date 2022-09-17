import React from 'react'

import type { TransactionState, TransactionProviderState } from './model'
import { TRANSACTION_STATE_INITIAL_STATE } from './model'

export const EthTransactionContext = React.createContext<TransactionProviderState>(TRANSACTION_STATE_INITIAL_STATE)

export function useTransactionL1() {
    return React.useContext(EthTransactionContext)
}
