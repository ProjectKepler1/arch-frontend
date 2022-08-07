
import React, { useEffect, useMemo, useState } from 'react'
import styles from './Registry.module.scss'
import { getNFTsForOwnerFilteredByCollection } from '../../nft-api/Alchemy'
import { accountInfo } from '../../providers/WalletsProvider'
import { promiseHandler } from '../../utils'
import registry from '../../../registry.json'
import Image from 'next/image'
const Registry = (props: any) => {
    const id = props.id
    const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
        arr.reduce((groups, item) => {
            (groups[key(item)] ||= []).push(item);
            return groups;
        }, {} as Record<K, T[]>);

    const collections = useMemo(() => props.registry && groupBy<any, any>(props.registry.ownedNfts, ((nft: any) => nft.contract.address)), [props.registry])
    if (props.id === '1') {
        return (
            <>
                {collections && Object.keys(collections).map((collectionAddress: string) => {
                    return (
                        <>

                            <div className={styles.selector} key={collections[collectionAddress][0].title} onClick={() => props.onClose(collectionAddress)} >
                                <div className={styles.frame11139}>
                                    <div className={styles.text}>
                                        {registry.find(r => r.L1_address === collectionAddress)?.name}
                                    </div>
                                    <div className={styles.subText}>
                                        {collectionAddress}

                                    </div>
                                </div>
                                <div className={styles.span}>
                                    {collections[collectionAddress].length}
                                </div>
                            </div>
                        </>
                    )
                })}
            </>)
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
                            <input type='checkbox' className={styles.checkbox}></input>
                            <span className={styles.checkmark}></span>
                        </label>
                    </div>
                </div>
                {collections && Object.keys(collections).map((collectionAddress: string) => {
                    return (
                        <div className={styles.selector} key={collections[collectionAddress][0].title}>
                            <div className={styles.ellipse4}>
                                <Image src={collections[collectionAddress][0].media[0].thumbnail} style={{ borderRadius: '45px' }} layout="fill" objectFit='contain'></Image>
                            </div>
                            <div className={styles.frame11139}>
                                <div className={styles.text3}>
                                    {parseInt(collections[collectionAddress][0].id.tokenId)}
                                </div>
                            </div>
                            <div className={styles.frame1111}>
                                <label className={styles.checkboxStyle}>
                                    <input type='checkbox' className={styles.checkbox}></input>
                                    <span className={styles.checkmark}></span>
                                </label>
                            </div>
                        </div>
                    )
                })}

            </>
        )
    }
}

export default Registry