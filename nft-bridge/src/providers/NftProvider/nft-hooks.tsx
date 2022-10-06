import React, { useContext } from 'react'
import { bnToUint256 } from 'starknet/dist/utils/uint256'
import { NftContext } from './NftProvider'
export const useNFTCollection = () => {
    const context = useContext(NftContext)
    return (context.bridgeregistry)
}
export const useStarknetNFTCollection = () => {
    const context = useContext(NftContext)
    return context.starknetBridgeregistry
}


export const useNFTCollectionGroupBy = () => {
    const context = useContext(NftContext)
    const collection = context.bridgeregistry;
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


export const useStarknetNFTCollectionGroupBy = () => {
    const context = useContext(NftContext)
    const newColl: any = []
    context.starknetBridgeregistry.forEach((element: any) => newColl.push(...element));
    let groupByCollection: Record<any, any[]> | null = null
    const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
        arr.reduce((groups, item) => {
            (groups[key(item)] ||= []).push(item);
            return groups;
        }, {} as Record<K, T[]>);
    groupByCollection = groupBy<any, any>(newColl, ((nft: any) => nft.contract_address))
    return (groupByCollection)

}

export const useStarknetNFTCollectionGroupByWithCont = (context: any) => {
    const newColl: any = []
    context.starknetBridgeregistry.forEach((element: any) => newColl.push(...element));
    let groupByCollection: Record<any, any[]> | null = null
    const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
        arr.reduce((groups, item) => {
            (groups[key(item)] ||= []).push(item);
            return groups;
        }, {} as Record<K, T[]>);
    groupByCollection = groupBy<any, any>(newColl, ((nft: any) => nft.contract_address))
    return (groupByCollection)
}

export const useCollectionTracker = (collectionAddress: string) => {
    const groupByCollection = useNFTCollectionGroupBy()
    return (groupByCollection[collectionAddress][0].contractMetadata ? groupByCollection[collectionAddress][0].contractMetadata.symbol : groupByCollection[collectionAddress][0].title)
}

export const useStarknetCollectionTracker = (collectionAddress: string) => {
    const context = useContext(NftContext)
    const groupByCollection = useStarknetNFTCollectionGroupBy()
    if (groupByCollection)
        return (groupByCollection[collectionAddress][0].contract.symbol)
}
export const useTokenIds = () => {
    const context = useContext(NftContext)
    return context.tokenIds
}
export const useTokenIdsToNumber = () => {
    const context = useContext(NftContext)
    return context.tokenIds.map((str: string) => { return Number(str) })

}
export const useTokenIdsUint = () => {
    const context = useContext(NftContext)
    return context.tokenIds.map((str: string) => { return bnToUint256(str) })
}
export const useSelectedContractAddress = () => {
    const context = useContext(NftContext)
    return context.selectedContractAddress
}

export const useSelectedContractAddress2 = () => {
    const context = useContext(NftContext)
    return context.selectedContractAddress2
}
export const useReceivingAddress = () => {
    const context = useContext(NftContext)
    return context.receivingAddress
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
export const useStarknetImageForIds = (contractAddress: string, tokenId: string) => {
    const groupByCollection = useStarknetNFTCollectionGroupBy()
    const svgToDataURL = require('svg-to-dataurl')
    let image: string = ""
    if (groupByCollection)
        groupByCollection[contractAddress].map((nft: any) => {
            if (tokenId == nft.token_id) {
                image = nft.image_uri ? svgToDataURL(nft.image_uri.replace('data:image/svg+xml,', "")) : nft.image_url_copy
            }
        })
    return (image)
}

export const useisCollectioninRegistry = (contract: string) => {
    const groupByCollection = useNFTCollectionGroupBy()
    const array = Object.keys(groupByCollection)
    return (array.includes(contract))
}

export const useIsStarknetCollectioninRegistry = (contract: string) => {
    const groupByCollection = useNFTCollectionGroupBy()
    if (groupByCollection) {
        const array = Object.keys(groupByCollection)
        return (array.includes(contract))
    }
}




export const useIsTokenInCollection2 = (collection: any, tokenId: string, contract: string) => {
    const condition = (element: any) => tokenId == parseInt(element.id.tokenId).toString()
    return collection[contract].some(condition)
}

export const useIsTokenInStarkCollection2 = (collection: any, tokenId: string, contract: string) => {
    const condition = (element: any) => tokenId == element.token_id
    return collection[contract].some(condition)
}

export const useSetBridgeDirection = (value: number) => {
    const context = useContext(NftContext)
    context.setBridgeDirection(value)
}

export const useBridgeDirection = () => {
    const context = useContext(NftContext)
    return (context.bridgeDirection)
}