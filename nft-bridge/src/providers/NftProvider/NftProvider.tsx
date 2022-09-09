
import React, { createContext, useCallback, useEffect, useState } from "react"
import { getNFTsForOwnerFilteredByCollection } from "../../nft-api/Alchemy"
import registry from '../../../registry.json'
import { accountInfo } from "../WalletsProvider"
import { Console } from "console"



export const NftContext = createContext<any | null>(null)


export const NftProvider = ({ children }: { children: any }) => {
    const [bridgeregistry, setBridgeRegistry] = useState<any>()
    const [starknetBridgeregistry, setStarknetBridgeregistry] = useState<any>([])
    const metaAddress = accountInfo.L1.account
    const starknetAddress = accountInfo.L2.account
    const [tokenIds, setTokenIds] = useState<string[]>([])
    const [receivingAddress, setReceivingAddress] = useState<string>('')
    const [selectedContractAddress, setSelectedContractAddress] = useState('')
    const [bridgeDirection, setBridgeDirection] = useState<number>(0)


    const getStarkNFTs = useCallback(() => {
        const getStarknetNFTCollection = async (collectionAddresses: string[], owner: string) => {
            const options = { method: 'GET', headers: { Accept: 'application/json' } };
            const filteredCollection = collectionAddresses.filter(function (value, index, arr) { return value !== "" })
            filteredCollection.map(async (address: string) => {
                const collection = await fetch(`https://api.aspect.co/api/v0/assets?contract_address=${address}&owner_address=0x038534bff953a3e91480f5f3126805c90002ae93c0e484ffd2c3535ab0bbcb0a`, options)
                const collectionObj = await collection.json()
                let newObj = [...starknetBridgeregistry]
                newObj[starknetBridgeregistry.length] = collectionObj
                // console.log(newObj)
                setStarknetBridgeregistry(newObj)
                // console.log(starknetBridgeregistry)
            })
            // setStarknetBridgeregistry(starknetBridge)
        }
        if (registry) {
            getStarknetNFTCollection(registry.map(reg => reg.L2_address), starknetAddress)
        }
    }, [registry, setStarknetBridgeregistry])


    const getNFTs = useCallback(() => {
        const getCollectionNFTs = async (collectionAddresses: string[], owner: string) => {
            const filteredCollection = collectionAddresses.filter(function (value, index, arr) { return value !== "" })
            const firstFilteredPage = await getNFTsForOwnerFilteredByCollection('0x04FD71a7c80dee02cec42cA7C6941D0940CBf55f', filteredCollection)
            setBridgeRegistry(firstFilteredPage)
        }
        if (registry) {
            getCollectionNFTs(registry.map(reg => reg.L1_address !== "" ? reg.L1_address : ""), metaAddress)
        }
    }, [registry, setBridgeRegistry])

    useEffect(() => {
        if (registry) {
            getNFTs();
            getStarkNFTs()
        }
    }, [registry, setStarknetBridgeregistry])

    const context = {
        bridgeregistry,
        bridgeDirection,
        setBridgeDirection,
        starknetBridgeregistry,
        tokenIds,
        setTokenIds,
        selectedContractAddress,
        setSelectedContractAddress,
        receivingAddress,
        setReceivingAddress
    }
    return (
        <NftContext.Provider value={context}>
            {children}
        </NftContext.Provider>
    )
}

export default NftProvider