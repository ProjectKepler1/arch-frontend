
import React, { createContext, useCallback, useEffect, useState } from "react"
import { getNFTsForOwnerFilteredByCollection } from "../../nft-api/Alchemy"
import registry from '../../../registry.json'
import { accountInfo } from "../WalletsProvider"


export const NftContext = createContext<any | null>(null)


export const NftProvider = ({ children }: { children: any }) => {
    const [bridgeregistry, setBridgeRegistry] = useState<any>()
    const metaAddress = accountInfo.L1.account
    const [tokenIds, setTokenIds] = useState<string[]>([])
    const [selectedContractAddress, setSelectedContractAddress] = useState('')
    const getNFTs = useCallback(() => {
        const getCollectionNFTs = async (collectionAddresses: string[], owner: string) => {
            const firstFilteredPage = await getNFTsForOwnerFilteredByCollection('0x04FD71a7c80dee02cec42cA7C6941D0940CBf55f', collectionAddresses)
            setBridgeRegistry(firstFilteredPage)
            console.log("done")
        }
        if (registry) {
            getCollectionNFTs(registry.map(reg => reg.L1_address), metaAddress)
        }
    }, [registry, setBridgeRegistry])

    useEffect(() => {
        if (registry) getNFTs()
    }, [registry])

    const context = {
        bridgeregistry,
        tokenIds,
        setTokenIds,
        selectedContractAddress,
        setSelectedContractAddress
    }
    return (
        <NftContext.Provider value={context}>
            {children}
        </NftContext.Provider>
    )
}

export default NftProvider