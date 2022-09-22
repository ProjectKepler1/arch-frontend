
import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { getNFTsForOwnerFilteredByCollection } from "../../nft-api/Alchemy"
import registry from '../../../registry.json'
import { accountInfo } from "../WalletsProvider"
import { Console } from "console"
import { ConnectionRejectedError } from "use-wallet"
import { supportedL1ChainId } from "../../config/envs"
import { NftContext } from "./NftProvider"



export const apiFetch = (collectionAddresses: string[], owner: string) => {
    const context = useContext(NftContext)
    const getStarkNFTs = useCallback((collectionAddresses: string[], owner: string) => {
        const filteredCollection = collectionAddresses.filter(function (value, index, arr) { return value !== "" })
        const promises: any = []
        filteredCollection.forEach(async (address) => promises.push(await getSingleStarkNFT(address, owner)))
        const array: any = []
        promises.forEach((element: any) => array.push(...element))
        console.log(array)
        context.setStarknetBridgeregistry(array)

    }, [registry])

    const getSingleStarkNFT = async (collectionAddress: string, owner: string) => {
        const options = { method: 'GET', headers: { Accept: 'application/json' } };
        const collection = await fetch(`https://api-testnet.aspect.co/api/v0/assets?contract_address=${collectionAddress}&owner_address=${owner}`, options)
        const collectionObj = await collection.json()
        return collectionObj.assets
    }
    getStarkNFTs(collectionAddresses, owner)
}