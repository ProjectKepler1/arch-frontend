
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './Registry.module.scss'
import { getNFTsForOwnerFilteredByCollection } from '../../nft-api/Alchemy'
import { accountInfo, useL1Wallet } from '../../providers/WalletsProvider'
import { promiseHandler } from '../../utils'
import registry from '../../../registry.json'
import Image from 'next/image'
import { useNFTCollection, useNFTCollectionGroupBy } from '../../providers/NftProvider/nft-hooks'
const Registry = (props: any) => {
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState<any>([]);
    const [nftsId, setNftsId] = useState<any>([])
    const bridgeregistryGroupBy = useNFTCollectionGroupBy()
    const bridgeregistry = useNFTCollection()
    const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
        arr.reduce((groups, item) => {
            (groups[key(item)] ||= []).push(item);
            return groups;
        }, {} as Record<K, T[]>);

    const handleSelectAll = () => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(nftsId);
        if (isCheckAll) {
            setIsCheck([]);
        }
    };
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
        setNftsId(getNftsId())
    }, [bridgeregistry, props.selectedContract])

    useEffect(() => {
        selectedNftsId()
    }, [bridgeregistry, props.selectedContract])

    if (props.id === '1') {
        return (
            <div className={styles.block}>
                {bridgeregistryGroupBy && Object.keys(bridgeregistryGroupBy).map((collectionAddress: string) => {
                    return (
                        <>
                            <div className={styles.selector} onClick={() => props.onClose(collectionAddress)} >
                                <div className={styles.frame11139}>
                                    <div className={styles.text}>
                                        {registry.find(r => r.L1_address === collectionAddress)?.name}
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
            </div>)
    }

    else {
        return (
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
        )
    }
}

export default Registry