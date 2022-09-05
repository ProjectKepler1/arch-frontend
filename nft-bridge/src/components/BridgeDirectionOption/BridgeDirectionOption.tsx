import Image from 'next/image'
import React from 'react'
import styles from './BridgeDirectionOption.module.scss'

import ethereum from '../../assets/svg/logos/eth.png'
import starknet from '../../assets/svg/logos/starknet.png'
import arrowRight from "../../assets/svg/vector/fi-arrow-right.svg"
import unArrowRight from '../../assets/svg/vector/arrow-right.svg'
const BridgeDirectionOption = (props: any) => {
    //index represents the bridge direction
    const options = [[
        ethereum,
        starknet,
        'Ethereum',
        'Starknet',
        'MetaMask'
    ], [
        starknet,
        ethereum,
        'Starknet',
        'Ethereum',
        'Argent X or Braavos']]
    const selectedOptions: any = options[props.index]
    return (
        <div className={styles.frame11148} style={props.active === props.index ? { border: 'solid 1px #57c6e4' } : { border: 'solid 1px #444652' }}>
            <div className={styles.frame11142}>
                <div className={styles.frame11143}>
                    <div className={styles.image12}>
                        <Image className={props.index === 0 ? styles.image12 : styles.image13} src={selectedOptions[0]}></Image>
                    </div>
                    <div className={props.index === 0 ? styles.ethereum : styles.starknet}>{selectedOptions[2]}</div>
                </div>
                <Image src={props.active === props.index ? arrowRight : unArrowRight}
                    className={styles.fiArrowRight}></Image>
                <div className={styles.frame11144}>
                    <div className={props.index === 0 ? styles.image12 : styles.image13}>
                        <Image className={styles.image13} src={selectedOptions[1]}></Image>
                    </div>
                    <div className={props.index === 0 ? styles.starknet : styles.ethereum}>{selectedOptions[3]}</div>
                </div>
            </div>
            <div className={props.index === 0 ? styles.walletConnect : styles.argentXorBraavos}>{selectedOptions[4]}</div>
        </div >
    )
}

export default BridgeDirectionOption