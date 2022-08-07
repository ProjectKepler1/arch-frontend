import Image from 'next/image'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './Process.module.scss'
import ethLogo from '../../assets/svg/logos/eth.png'
import question from '../../assets/svg/vector/Tool Tips .svg'
import { accountInfo } from '../../providers/WalletsProvider'
import ModifiedInput from '../ModifiedInput/ModifiedInput'
import InputError from '../ErrorState/InputError'
import ModalBridge from '../ModalBridge/ModalBridge'
import HandleCheck from '../HandleCheck/HandleCheck'
import registry from '../../../registry.json'
import { getNFTsForOwnerFilteredByCollection } from '../../nft-api/Alchemy'

const Process = () => {
    const [inputState, setInputState] = useState(false)
    const [errorState, setErrorState] = useState(false)
    const [show, setShow] = useState(false)
    const [bridgeregistry, setBridgeRegistry] = useState<any>()
    const [change, setChange] = useState(false)
    const [change1, setChange1] = useState(false)
    const starknetAddress = accountInfo.L2.account
    const metaAddress = accountInfo.L1.account
    let maxInput = 7
    let x = 2
    const addInputField = () => {
        if (x < maxInput) {
            x++;
        }
    }
    const getNFTs = useCallback(() => {
        const countNFTs = async (collectionAddresses: string[], owner: string) => {
            const firstFilteredPage = await getNFTsForOwnerFilteredByCollection('0x2137213d50207Edfd92bCf4CF7eF9E491A155357', collectionAddresses)
            setBridgeRegistry(firstFilteredPage)
            console.log(firstFilteredPage)
        }
        if (registry) {
            countNFTs(registry.map(reg => reg.L1_address), metaAddress)
        }
    }, [registry, setBridgeRegistry])

    const handleChange = () => {
        setChange(!change)
    }

    const handleChange1 = () => {
        setChange1(!change1)
    }
    const handleInputState = () => {
        if (starknetAddress.length < 3) {
            setErrorState(true)
        }
        else {
            setInputState(!inputState)
        }
    }

    useEffect(() => {
        if (registry) getNFTs()
    }, [registry])

    return (
        <div className={styles.frame7}>
            <div className={styles.frame11142}>
                <div className={styles.frame11142bis}>
                    <div className={styles.image12}>
                        <Image src={ethLogo} style={{ position: 'relative' }} />
                    </div>
                    <div className={styles.erc721}>ERC721</div>
                </div>
            </div>
            <div className={styles.bloc1}>
                <div className={styles.header1}>
                    <div className={styles.text}>Select ERC721 Address</div>
                    <div className={styles.bordSub}>Manually enter address</div>
                    <label className={styles.checkboxStyle}>
                        <input type='checkbox' className={styles.checkbox} onChange={handleChange}></input>
                        <span className={styles.checkmark}></span>
                    </label>
                </div>
                <HandleCheck change={change} registry={bridgeregistry} change1={change1} id='1' />
                <div className={styles.endblock1}>
                    <div className={styles.subBlock1}>
                        <div className={styles.subText2}>Verify Bridge Registry to Proceed</div>
                        <Image src={question} style={{ cursor: 'pointer' }}></Image>
                    </div>
                    <button className={styles.button1}>Check Verification</button>
                </div>
            </div>
            <div className={styles.bloc2}>
                <div className={styles.header1}>
                    <div className={styles.text1}>Select Token IDS</div>
                    <Image src={question} style={{ cursor: 'pointer' }}></Image>
                    <div className={styles.bordSub}>Manually enter token IDS</div>
                    <label className={styles.checkboxStyle}>
                        <input type='checkbox' className={styles.checkbox} onChange={handleChange1}></input>
                        <span className={styles.checkmark}></span>
                    </label>

                </div>
                <HandleCheck change={change} change1={change1} registry={bridgeregistry} id="2" />
            </div>
            <div className={styles.line4} />
            <div className={styles.bloc3}>
                <div className={styles.text2}>Enter your Starknet Address</div>
                <div className={styles.subText3}>Enter the receiving Starknet Address</div>
                <div className={styles.subblock3}>
                    <div className={styles.subText2}>Starknet Address</div>
                    <div className={styles.subText4} onClick={handleInputState}>Use my StarkNet Address</div>
                </div>
                <InputError state={errorState} error="Please connect your Starknet wallet first" />
                <ModifiedInput value={starknetAddress} state={inputState} />
            </div>
            <div className={styles.bottom1}>
                <button className={styles.button3}>Continue</button>
            </div>
        </div >
    )
}

export default Process