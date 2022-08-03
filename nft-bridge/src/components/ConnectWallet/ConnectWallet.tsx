import Image from 'next/image'
import React, { useMemo, useState } from 'react'
import styles from './ConnectWallet.module.scss'
import InputError from '../ErrorState/InputError'
import { resourceUsage } from 'process'

const ConnectWallet = (props: any) => {

    const handleError = useMemo(function () {
        if (props.error !== null) {
            return (true)
        }
    }, [props.error])
    return (
        <div className={styles.frame11142}>
            <div className={styles.frame11144}>
                {/* <div className={styles.frame11146}> */}
                <div className={styles.image12}>
                    <Image src={props.logoURL} />
                </div>
                {/* </div> */}
                <div className={styles.frame11110}>
                    <div className={styles.ethereum}>
                        {props.name}
                    </div>
                    <div className={styles.networkMainnet}>Network : {props.type}</div>
                </div>
                {props.children}
            </div>
            <InputError state={handleError} error={props.error}></InputError>
            <div className={styles.frame11139}>
                <div className={styles.frame2}>
                    <div className={styles.ethAddress}>{props.name} Address : </div>
                    <div className={styles.emAddress}>{props.address}</div>
                </div>
                <div className={styles.frame2}>
                    <div className={styles.eth}> ETH : </div>
                    <div className={styles.balance}>{props.balance}</div>
                </div>
            </div>
        </div>

    )
}

export default ConnectWallet