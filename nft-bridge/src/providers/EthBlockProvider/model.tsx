export interface BlockManagerState {
    blockHashEth?: string
    blockNumberEth?: number
}

export const BLOCK_STATE_INITIAL_STATE: BlockManagerState = {
    blockNumberEth: undefined,
    blockHashEth: undefined,
}
