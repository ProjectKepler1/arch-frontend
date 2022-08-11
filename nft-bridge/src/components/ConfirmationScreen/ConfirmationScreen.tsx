import React from "react"
import styles from './ConfirmationScreen.module.scss'
import { accountInfo } from "../../providers/WalletsProvider"
import { truncateAddress2, truncateAddress } from "../../utils"
import copy from '../../assets/svg/vector/copy.svg'
import Image from "next/image"
import { useTokenIds, useNFTCollection, useSelectedContractAddress, useCollectionTracker, useImageForIds } from "../../providers/NftProvider/nft-hooks"
import { supportedLiquidityProviders } from "../../config/envs"
import Link from 'next/link'
const ConfirmationScreen = () => {
    const bridgeregistry = useNFTCollection()
    const tokenIds = useTokenIds()
    const contractAddress = useSelectedContractAddress()
    const tracker = useCollectionTracker(contractAddress)
    return (
        <div className={styles.frame11144}>
            <div className={styles.frame11141}>
                <div className={styles.text1}>
                    Eth Address:
                </div>
                <div className={styles.block}>
                    <div className={styles.address1}>
                        {truncateAddress2(accountInfo.L1.account)}
                    </div>
                    <Image src={copy} onClick={() => navigator.clipboard.writeText(accountInfo.L1.account)}></Image>
                </div>
            </div>
            <div className={styles.frame11141}>
                <div className={styles.text1}>
                    Starknet Address:
                </div>
                <div className={styles.block}>
                    <div className={styles.address1}>
                        {truncateAddress(accountInfo.L2.account)}
                    </div>
                    <Image src={copy} onClick={() => navigator.clipboard.writeText(accountInfo.L2.account)} />
                </div>
            </div>
            <div className={styles.frame11141}>
                <div className={styles.text1}>
                    Token Ids:
                </div>
                <div className={styles.address1}>
                    {tokenIds}
                </div>
            </div>
            <div className={styles.frame11141}>
                <div className={styles.text1}>
                    Tracker:
                </div>
                <div className={styles.address1}>
                    {tracker.toString()}
                </div>
            </div>
            <div className={styles.frame11145}>
                {tokenIds.map((id: string) => {
                    return (
                        <div className={styles.frame11146}>
                            <div className={styles.image13}>
                                <img src={useImageForIds(contractAddress, id)} />
                            </div>
                            <div className={styles.span}>{id}</div>

                        </div>
                    )
                })}
            </div>
            <div className={styles.line4} />
            <div className={styles.frame11148}>
                <div className={styles.frame2}>

                    <div className={styles.text1}>
                        Network Fee (Total):
                    </div>
                    <div className={styles.eth}>
                        insert fee
                    </div>
                </div>
                <div className={styles.conversion}> conversion
                </div>
            </div>
            <div className={styles.warning}>
                Your wallet may ask you to sign with a slightly higher gas due to the
                15000 gas limit estimate. You will be charged similar to the gas
                estimate listed above
            </div>
            <div className={styles.frame11147}>
                <Link href="/">
                    <button className={styles.button1}>
                        Back
                    </button>
                </Link>
                <Link href="/approval">
                    <button className={styles.button2}>
                        Confirm
                    </button>
                </Link>
            </div>

        </div >
    )
}
export default ConfirmationScreen