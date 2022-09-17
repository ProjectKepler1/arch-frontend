import { useStarknetReact } from '@web3-starknet-react/core'
import { getStarknet } from 'get-starknet'
import React from 'react'
import { GetBlockResponse, Provider } from 'starknet'
import { supportedL1ChainId } from '../../config/envs'

import { BlockContext } from './block-context'

export interface BlockHashProviderProps {
    children: React.ReactNode
    interval?: number
}

export function BlockHashProvider({ interval, children }: BlockHashProviderProps): JSX.Element {

    const [blockHash, setBlockHash] = React.useState<string | undefined>(undefined)
    const [blockNumber, setBlockNumber] = React.useState<number | undefined>(undefined)
    const provider = getStarknet().provider
    const fetchBlockHash = React.useCallback(() => {
        provider
            ?.getBlock()
            .then((block: GetBlockResponse) => {
                setBlockHash(block.block_hash)
                setBlockNumber(block.block_number)

            })
            .catch(console.log)
    }, [provider])

    React.useEffect(() => {
        fetchBlockHash()
        const intervalId = setInterval(() => {
            fetchBlockHash()
        }, interval ?? 5000)
        return () => clearInterval(intervalId)
    }, [interval, fetchBlockHash])

    return (
        <BlockContext.Provider value={{ blockHash, blockNumber }}>
            {children}
        </BlockContext.Provider>
    )
}
