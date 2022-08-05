import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styles from './Process.module.scss'
import ethLogo from '../../assets/svg/logos/eth.png'
import question from '../../assets/svg/vector/Tool Tips .svg'
import { accountInfo } from '../../providers/WalletsProvider'
import ModifiedInput from '../ModifiedInput/ModifiedInput'
import InputError from '../ErrorState/InputError'
import ModalBridge from '../ModalBridge/ModalBridge'
import HandleCheck from '../HandleCheck/HandleCheck'
const Process = () => {
    const [inputState, setInputState] = useState(false)
    const [errorState, setErrorState] = useState(false)
    const [show, setShow] = useState(false) 
    const [change, setChange] = useState(false)
    const starknetAddress = accountInfo.L2.account
    let maxInput = 7
    let x = 2
    const addInputField = () => {
        if (x < maxInput) {
            x++;
        }
    }
    const handleChange = () => {
        setChange(!change)
        console.log(change)
    }
    const handleInputState = () => {
        if (starknetAddress.length < 3) {
            setErrorState(true)
        }
        else {
            setInputState(!inputState)
        }
    }

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
                <HandleCheck change={change} />
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
                        <input type='checkbox' className={styles.checkbox}></input>
                        <span className={styles.checkmark}></span>
                    </label>

                </div>
                <input className={styles.input1} placeholder='Enter Address'></input>
                <input className={styles.input1} placeholder='Enter Address'></input>
                <button className={styles.button2} onClick={addInputField}>Add Token IDs</button>
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