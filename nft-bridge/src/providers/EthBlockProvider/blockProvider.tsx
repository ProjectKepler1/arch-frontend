
import React from 'react'

import { web3 } from '../../libs'
import { EthBlockContext } from './block-context'


export interface BlockHashProviderProps {
    children: React.ReactNode
    interval?: number
}

export function EthBlockHashProvider({ interval, children }: BlockHashProviderProps): JSX.Element {

    const [blockNumberEth, setBlockNumberEth] = React.useState<number | undefined>(undefined)
    const fetchBlockHash = React.useCallback(() => {
        web3.eth.getBlockNumber()
            .then((block: any) => {
                setBlockNumberEth(block)

            })
    }, [])

    React.useEffect(() => {
        fetchBlockHash()
        const intervalId = setInterval(() => {
            fetchBlockHash()
        }, interval ?? 5000)
        return () => clearInterval(intervalId)
    }, [interval, fetchBlockHash])

    return (
        <EthBlockContext.Provider value={{ blockNumberEth }}>
            {children}
        </EthBlockContext.Provider>
    )
}
