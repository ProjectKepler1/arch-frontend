import React, { useContext } from 'react'
import { NftContext } from './NftProvider'
export const useNFTCollection = () => {
    const context = useContext(NftContext)
    return (context.bridgeregistry)
}


export const useNFTCollectionGroupBy = () => {
    const context = useContext(NftContext)
    const collection = context.bridgeregistry
    const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
        arr.reduce((groups, item) => {
            (groups[key(item)] ||= []).push(item);
            return groups;
        }, {} as Record<K, T[]>);
    const groupByCollection = groupBy<any, any>(collection.ownedNfts, ((nft: any) => nft.contract.address))
    return (groupByCollection)
}

export const useNFTCollectionGroupByWithCont = (context: any) => {
    const collection = context.bridgeregistry
    const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
        arr.reduce((groups, item) => {
            (groups[key(item)] ||= []).push(item);
            return groups;
        }, {} as Record<K, T[]>);
    const groupByCollection = groupBy<any, any>(collection.ownedNfts, ((nft: any) => nft.contract.address))
    return (groupByCollection)
}

export const useCollectionTracker = (collectionAddress: string) => {
    const groupByCollection = useNFTCollectionGroupBy()
    return (groupByCollection[collectionAddress][0].contractMetadata ? groupByCollection[collectionAddress][0].contractMetadata.symbol : groupByCollection[collectionAddress][0].title)
}
export const useTokenIds = () => {
    const context = useContext(NftContext)
    return context.tokenIds
}
export const useSelectedContractAddress = () => {
    const context = useContext(NftContext)
    return context.selectedContractAddress
}

export const useImageForIds = (contractAddress: string, tokenId: string) => {
    const svgToDataURL = require('svg-to-dataurl')
    const groupByCollection = useNFTCollectionGroupBy()
    let image: string = ""
    groupByCollection[contractAddress].map((nft: any) => {
        if (tokenId == (parseInt(nft.id.tokenId).toString())) {
            image = nft.media[0].thumbnail ? nft.media[0].thumbnail : nft.media[0].gateway ? nft.media[0].gateway : svgToDataURL(nft.media[0].raw.replace('data:image/svg+xml;utf8,', ""))
        }
    })
    return (image)
}

export const useisCollectioninRegistry = (contract: string) => {
    const groupByCollection = useNFTCollectionGroupBy()
    const array = Object.keys(groupByCollection)
    return (array.includes(contract))
}


//This function can be improved, without using if loop.
export const useIsTokenIdinCollection = (tokenId: string, contract: string) => {
    const groupByCollection = useNFTCollectionGroupBy()
    if (useisCollectioninRegistry(contract)) {
        groupByCollection[contract].map((nft: any) => {
            if (tokenId == (parseInt(nft.id.tokenId).toString())) {
                return (true)
            }
        })
        return (false)
    }
}

export const useIsTokenInCollection2 = (collection: any, tokenId: string, contract: string) => {
    const condition = (element: any) => tokenId == parseInt(element.id.tokenId).toString()
    return collection[contract].some(condition)
}
