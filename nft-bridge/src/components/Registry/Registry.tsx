
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styles from './Registry.module.scss'
import { getNFTsForOwnerFilteredByCollection } from '../../nft-api/Alchemy'
import { accountInfo, useL1Wallet } from '../../providers/WalletsProvider'
import { promiseHandler, truncateAddress } from '../../utils'
import registry from '../../../registry.json'
import Image from 'next/image'
import { useNFTCollection, useNFTCollectionGroupBy, useStarknetNFTCollection, useStarknetNFTCollectionGroupBy } from '../../providers/NftProvider/nft-hooks'
import { NftContext } from '../../providers/NftProvider/NftProvider'
const Registry = (props: any) => {
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState<any>([]);
    const [nftsId, setNftsId] = useState<any>([])
    const bridgeregistryGroupBy = useNFTCollectionGroupBy()
    const context = useContext(NftContext)
    const bridgeregistry = useNFTCollection()
    const starknetBridgeregistry = useStarknetNFTCollection()
    const starknetBridgeregistryGroupBy = useStarknetNFTCollectionGroupBy()
    // const starknetBridgeregistry = useStarknetNFTCollectionGroupBy()

    const handleSelectAll = () => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(nftsId);
        if (isCheckAll) {
            setIsCheck([]);
        }
    };
    const handleClosure = () => {
        var imageIds: string[] = []
        isCheck.map((id: string) => {
            imageIds.push(useStarknetImageForIds(props.selectedContract, id))
        })
        console.log(imageIds)
        context.setTokenImage(imageIds)
        localStorage.setItem('imageIds',
            JSON.stringify(
                imageIds.map((id: string) => {
                    // Remove successCallback & errorCallback before stringify
                    return id
                })))
        props.onClose(isCheck)
    }

    const useStarknetImageForIds = (contractAddress: string, tokenId: string) => {
        const svgToDataURL = require('svg-to-dataurl')
        let image: string = ""
        if (starknetBridgeregistryGroupBy)
            starknetBridgeregistryGroupBy[contractAddress].map((nft: any) => {
                if (tokenId == nft.token_id) {
                    image = nft.image_uri ? svgToDataURL(nft.image_uri.replace('data:image/svg+xml,', "")) : nft.image_url_copy
                }
            })
        return (image)
    }
    const handleClick = (e: any) => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter((item: any) => item !== id));
        }

    };
    const svgToDataURL = require('svg-to-dataurl')
    // const NftsId = useMemo(() => props.registry && props.registry.ownedNfts.map((nft: any) => { return (parseInt(nft.id.tokenId).toString()) }), [props.registry])
    const selectedNftsId = useCallback(() => {
        const getNftsId = () => {
            if (context.bridgeDirection == 1) {
                if (props.selectedContract != null) {
                    return (starknetBridgeregistryGroupBy && starknetBridgeregistryGroupBy[props.selectedContract].map((nft: any) => {
                        return (nft.token_id)
                    }))
                }
            }
            else {
                if (props.selectedContract != null) {
                    return (bridgeregistryGroupBy && bridgeregistryGroupBy[props.selectedContract].map((nft: any) => {
                        return (parseInt(nft.id.tokenId).toString())
                    }))
                }
                else {
                    return (bridgeregistry.ownedNfts && bridgeregistry.ownedNfts.map((nft: any) => {
                        return (parseInt(nft.id.tokenId).toString())
                    }))
                }
            }
        }
        setNftsId(getNftsId())
    }, [bridgeregistry, props.selectedContract, context.bridgeDirection])

    useEffect(() => {
        if (bridgeregistryGroupBy && starknetBridgeregistryGroupBy)
            selectedNftsId()

    }, [bridgeregistry, props.selectedContract, context.bridgeDirection])

    if (props.id === '1') {
        return (
            <>
                {context.bridgeDirection == 0 &&
                    <div className={styles.block}>
                        {bridgeregistryGroupBy && Object.keys(bridgeregistryGroupBy).map((collectionAddress: string) => {
                            return (
                                <>
                                    <div className={styles.selector} onClick={() => { props.onClose(collectionAddress) }} key={collectionAddress}>
                                        <div className={styles.frame11139}>
                                            <div className={styles.text}>
                                                {bridgeregistryGroupBy[collectionAddress][0].contractMetadata?.name ?? registry.find(r => r.L1_address === collectionAddress)?.name}
                                            </div>
                                            <div className={styles.subText}>
                                                {collectionAddress}

                                            </div>
                                        </div>
                                        <div className={styles.span}>
                                            {bridgeregistryGroupBy[collectionAddress].length}
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                    </div>
                }
                {
                    context.bridgeDirection == 1 &&
                    <div className={styles.block}>
                        {starknetBridgeregistryGroupBy && Object.keys(starknetBridgeregistryGroupBy).map((collectionAddress: string) => {
                            return (
                                <>
                                    <div className={styles.selector} onClick={() => { context.setTracker(starknetBridgeregistryGroupBy[collectionAddress][0].contract.symbol); localStorage.setItem('Tracker', starknetBridgeregistryGroupBy[collectionAddress][0].contract.symbol); props.onClose(collectionAddress) }} key={collectionAddress}>
                                        <div className={styles.frame11139}>
                                            <div className={styles.text}>
                                                {starknetBridgeregistryGroupBy[collectionAddress][0].contract?.name ?? registry.find(r => r.L2_address === collectionAddress)?.name}
                                            </div>
                                            <div className={styles.subText}>
                                                {truncateAddress(collectionAddress)}
                                            </div>
                                        </div>
                                        <div className={styles.span}>
                                            {starknetBridgeregistryGroupBy[collectionAddress].length}
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                    </div>
                }
            </>
        )
    }


    else {
        return (
            <>
                {context.bridgeDirection == 0 &&
                    <>
                        <div className={styles.frame11142} >
                            <div className={styles.frame11143}>
                                <div className={styles.subText2}>
                                    Select All Ids
                                </div>
                                <label className={styles.checkboxStyle}>
                                    <input type='checkbox' className={styles.checkbox} onClick={handleSelectAll} onChange={e => { }} checked={isCheckAll}></input>
                                    <span className={styles.checkmark}></span>
                                </label>
                            </div>
                        </div>
                        <div className={styles.block}>
                            {props.selectedContract == null && bridgeregistry.ownedNfts && bridgeregistry.ownedNfts.map((nft: any) => {
                                return (
                                    <div className={styles.selector} >
                                        <div className={styles.ellipse4}>
                                            <img className={styles.ellipse4} src={nft.media[0].thumbnail ? nft.media[0].thumbnail : nft.media[0].gateway ? nft.media[0].gateway : svgToDataURL(nft.media[0].raw.replace('data:image/svg+xml;utf8,', ""))} style={{ borderRadius: '45px' }} ></img>
                                        </div>
                                        <div className={styles.frame11139}>
                                            <div className={styles.text3}>
                                                {parseInt(nft.id.tokenId)}
                                            </div>
                                        </div>
                                        <div className={styles.frame1111}>
                                            <label className={styles.checkboxStyle}>
                                                <input type='checkbox' className={styles.checkbox} id={parseInt(nft.id.tokenId).toString()} onChange={e => { }} onClick={handleClick} checked={isCheck.includes(parseInt(nft.id.tokenId).toString())} ></input>
                                                <span className={styles.checkmark}></span>
                                            </label>
                                        </div>
                                    </div>
                                )
                            })}
                            {
                                props.selectedContract != null && bridgeregistryGroupBy && bridgeregistryGroupBy[props.selectedContract].map((nft: any) => {
                                    return (
                                        <div className={styles.selector} >
                                            <div className={styles.ellipse4}>
                                                <img className={styles.ellipse4} src={nft.media[0].thumbnail ? nft.media[0].thumbnail : nft.media[0].gateway ? nft.media[0].gateway : svgToDataURL(nft.media[0].raw.replace('data:image/svg+xml;utf8,', ""))} style={{ borderRadius: '45px' }}></img >
                                            </div>
                                            <div className={styles.frame11139}>
                                                <div className={styles.text3}>
                                                    {parseInt(nft.id.tokenId)}
                                                </div>
                                            </div>
                                            <div className={styles.frame1111}>
                                                <label className={styles.checkboxStyle}>
                                                    <input type='checkbox' className={styles.checkbox} id={parseInt(nft.id.tokenId).toString()} onChange={e => { }} onClick={handleClick} checked={isCheck.includes(parseInt(nft.id.tokenId).toString())} ></input>
                                                    <span className={styles.checkmark}></span>
                                                </label>
                                            </div>
                                        </div>)
                                }
                                )}
                        </div>
                        <div className={styles.bottom1}>
                            <button className={styles.button3} onClick={() => props.onClose(isCheck)} > Add {isCheck.length} TokenIDs</button>
                        </div>
                    </>
                }
                {context.bridgeDirection == 1 &&
                    <>
                        <div className={styles.frame11142} >
                            <div className={styles.frame11143}>
                                <div className={styles.subText2}>
                                    Select All Ids
                                </div>
                                <label className={styles.checkboxStyle}>
                                    <input type='checkbox' className={styles.checkbox} onClick={handleSelectAll} onChange={e => { }} checked={isCheckAll}></input>
                                    <span className={styles.checkmark}></span>
                                </label>
                            </div>
                        </div>
                        <div className={styles.block}>
                            {
                                props.selectedContract != null && starknetBridgeregistryGroupBy && starknetBridgeregistryGroupBy[props.selectedContract].map((nft: any) => {

                                    return (
                                        <div className={styles.selector} >
                                            <div className={styles.ellipse4}>
                                                <img className={styles.ellipse4} src={svgToDataURL(nft.image_uri?.replace('data:image/svg+xml,', ""))} style={{ borderRadius: '45px' }}></img >
                                            </div>
                                            <div className={styles.frame11139}>
                                                <div className={styles.text3}>
                                                    {nft.token_id}
                                                </div>
                                            </div>
                                            <div className={styles.frame1111}>
                                                <label className={styles.checkboxStyle}>
                                                    <input type='checkbox' className={styles.checkbox} id={nft.token_id} onChange={e => { }} onClick={handleClick} checked={isCheck.includes(nft.token_id)} ></input>
                                                    <span className={styles.checkmark}></span>
                                                </label>
                                            </div>
                                        </div>)
                                }
                                )}
                        </div>
                        <div className={styles.bottom1}>
                            <button className={styles.button3} onClick={handleClosure} > Add {isCheck.length} TokenIDs</button>
                        </div>
                    </>
                }

            </>
        )
    }
}

export default Registry