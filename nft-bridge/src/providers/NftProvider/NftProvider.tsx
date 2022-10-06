
import React, { createContext, useCallback, useEffect, useState } from "react"
import { getNFTsForOwnerFilteredByCollection } from "../../nft-api/Alchemy"
import registry from '../../../registry.json'
import { accountInfo } from "../WalletsProvider"
import { Console } from "console"
import { ConnectionRejectedError } from "use-wallet"
import { supportedL1ChainId } from "../../config/envs"



export const NftContext = createContext<any | null>(null)


export const NftProvider = ({ children }: { children: any }) => {
    const [bridgeregistry, setBridgeRegistry] = useState<any>()
    const [starknetBridgeregistry, setStarknetBridgeregistry] = useState<any>([])
    const metaAddress = accountInfo.L1.account
    const starknetAddress = accountInfo.L2.account
    const [tokenIds, setTokenIds] = useState<string[]>([])
    const [receivingAddress, setReceivingAddress] = useState<string>('')
    const [sendingAddress, setSendingAddress] = useState<string>('')
    const [selectedContractAddress, setSelectedContractAddress] = useState('')
    const [selectedContractAddress2, setSelectedContractAddress2] = useState('')
    const [bridgeDirection, setBridgeDirection] = useState<number>(0)
    const [tracker, setTracker] = useState<string>()
    const [tokenImage, setTokenImage] = useState<string[]>()
    const [network, setNetwork] = useState<number>(5)
    const getNFTs = useCallback((collectionAddresses: string[], owner: string) => {
        const getCollectionNFTs = async () => {
            const filteredCollection = collectionAddresses.filter(function (value, index, arr) { return value !== "" })
            const firstFilteredPage = await getNFTsForOwnerFilteredByCollection(owner, filteredCollection)
            setBridgeRegistry(firstFilteredPage)
        }
        // getCollectionNFTs(registry.map(reg => reg.L1_address !== "" ? reg.L1_address : ""), metaAddress)
        getCollectionNFTs()
    }, [registry, setBridgeRegistry])

    // useEffect(() => {
    //     if (registry) {
    //         getNFTs();
    //         getStarkNFTs()
    //     }
    // }, [registry, setStarknetBridgeregistry])

    const context = {
        bridgeregistry,
        bridgeDirection,
        network, setNetwork,
        setBridgeDirection,
        starknetBridgeregistry,
        setStarknetBridgeregistry,
        tokenIds,
        tracker,
        setTracker,
        setTokenIds,
        tokenImage,
        sendingAddress,
        setSendingAddress,
        setTokenImage,
        selectedContractAddress,
        setSelectedContractAddress,
        selectedContractAddress2,
        setSelectedContractAddress2,
        receivingAddress,
        setReceivingAddress,
        getNFTs,

    }
    return (
        <NftContext.Provider value={context}>
            {children}
        </NftContext.Provider>
    )
}

export default NftProvider