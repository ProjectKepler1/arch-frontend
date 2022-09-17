import React from 'react'

import type { BlockManagerState } from './model'
import { BLOCK_STATE_INITIAL_STATE } from './model'

export const EthBlockContext = React.createContext<BlockManagerState>(BLOCK_STATE_INITIAL_STATE)

export function useBlockEth() {
    return React.useContext(EthBlockContext)
}
