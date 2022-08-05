
import React, { useEffect, useState } from 'react'
import registry from '../../../registry.json'
import styles from './Registry.module.scss'
import { getNFTsForOwnerFilteredByCollection } from '../../nft-api/Alchemy'
import { accountInfo } from '../../providers/WalletsProvider'
import { promiseHandler } from '../../utils'
const Registry = (props: any) => {
    const [count, setCount]=useState(0)
    
    return (
        <>
            {registry && registry.map((reg: any) => {
            const countNFTs = async (address :string, owner :string) =>{
                const firstFilteredPage = await getNFTsForOwnerFilteredByCollection(owner,address)
                setCount(Object.keys(firstFilteredPage).length)
            }
            countNFTs(accountInfo.L1.account,reg.L1_address)
                return (
                    <div className={styles.selector} key={reg.id} onClick={() => props.onClose(reg)} >
                        <div className={styles.frame11139}>
                            <div className={styles.text}>
                                {reg.name}
                            </div>
                            <div className={styles.subText}>
                                {reg.L1_address}
                            </div>
                        </div>
                        <div className={styles.span}>
                        {count}
                        </div>
                    </div>
                )
            })}
        </>
    )
}

export default Registry