
import React, { useContext, useEffect, useState } from 'react'
import { useisCollectioninRegistry, useNFTCollectionGroupBy, useNFTCollectionGroupByWithCont, useStarknetNFTCollectionGroupByWithCont } from '../../providers/NftProvider/nft-hooks'
import ModalBridge from '../ModalBridge/ModalBridge'
import styles from './HandleCkech.module.scss'
import InputError from '../ErrorState/InputError'
import MultiInput from '../MultiInput/MultiInput'
import { NftContext } from '../../providers/NftProvider/NftProvider'
import question from '../../assets/svg/vector/Tool Tips .svg'
import check from '../../assets/svg/vector/check-svgrepo-com.svg'
import Image from 'next/image'
import { truncateAddress, truncateAddress2 } from '../../utils'
import { accountInfo } from '../../providers/WalletsProvider'
const HandleCheck = (props: any) => {
    const [show, setShow] = useState(false)
    const [selected, setSelected] = useState<any>(null)
    const [selected1, setSelected1] = useState<string[] | null>(null)
    const [selected2, setSelected2] = useState<any>(null)
    const [inputAddress, setInputAddress] = useState<any>(null)
    const [errorStateAddress, setErrorStateAddress] = useState<boolean | null>(null)
    const [errorStateToken, setErrorStateToken] = useState<boolean>(false)
    const [errorStateConnexion, setErrorStateConnexion] = useState<boolean>(false)
    const [counter, setCounter] = useState<number>(1)
    const context = useContext(NftContext)
    useEffect(() => {
        setSelected(null)
        setSelected1(null)
        props.returnContract(null)
        setErrorStateAddress(null)
    }, [context.bridgeDirection])

    const resetStatus = () => {
        setErrorStateAddress(null)
        setInputAddress(null)
        setCounter(1)
    }

    useEffect(() => {
        resetStatus()
    }, [props.change, props.change1])


    const handleClose = (value: any) => {
        setShow(false);
        setSelected(value);
        props.returnContract(value);
    }
    const checkAddressValidity = (groupByCollection: any) => {
        const array = Object.keys(groupByCollection)
        if (array.includes(inputAddress)) {
            setSelected2(inputAddress)
            setErrorStateAddress(false)
            props.returnContract(inputAddress)
        }
        else setErrorStateAddress(true);
    }
    const handleChange1 = (groupByCollection: any) => (e: any) => {
        const address = e.target.value
        const array = Object.keys(groupByCollection)
        if (array.includes(address)) {
            setSelected2(address)
            props.returnContract(address)
        }
        else {
            setErrorStateAddress(true)
        }

    }
    const handleClose1 = (value: any) => {
        setShow(false);
        setSelected1(value);
        props.returnTokenId(value)
    }


    const handleClick = () => {
        if (props.contract) {
            setErrorStateToken(false)
            setShow(true)
        }
        else {
            setErrorStateToken(true)
        }
    }
    if (context.bridgeregistry && props.id === '1' && accountInfo.L2.account !== "") {
        const groupByCollection = context.bridgeDirection == 0 ? useNFTCollectionGroupByWithCont(context) : useStarknetNFTCollectionGroupByWithCont(context)
        return (
            <>
                {
                    props.change &&
                    <>
                        <input className={styles.input1} placeholder={'Enter Address'} onChange={(e: any) => setInputAddress(e.target.value)}></input>
                        <InputError state={errorStateAddress} error="Address not registered in the bridge" />
                        <div className={styles.endblock1}>
                            <div className={styles.subBlock1}>
                                <div className={styles.subText2}>Verify Bridge Registry to Proceed</div>
                                <Image src={question} style={{ cursor: 'pointer' }}></Image>
                            </div>
                            <button className={styles.button1} onClick={() => checkAddressValidity(groupByCollection)}>Check Verification</button>
                            {
                                errorStateAddress === false &&
                                <Image src={check}></Image>
                            }
                        </div>
                    </>
                }
                {
                    !props.change &&
                    <>
                        <div className={styles.modified_input} style={!selected ? { color: "#6b7082", fontSize: "14px", fontStyle: "normal", fontWeight: "normal", fontFamily: "Roboto", letterSpacing: "normal", textAlign: "left" } : { color: "#fff" }} onClick={() => setShow(true)} >{selected ? truncateAddress2(selected) : "Enter Address"}</div>
                        <ModalBridge onClose={(value: any) => handleClose(value)} show={show} title="Select Contract" id={props.id} selectedContract={selected} />
                    </>
                }
            </>)
    }
    if (props.id === '2') {
        return (
            <>
                {
                    props.change1 &&
                    <>

                        {props.contract && <MultiInput address={props.contract} onSelect={(value: any) => handleClose1(value)} state={false} />}
                        {!props.contract && <MultiInput address={props.contract} onSelect={(value: any) => handleClose1(value)} state={true} />}
                        {/* <button className={styles.subText4} onClick={handleClick}>Add Tokens Ids</button> */}
                    </>
                }
                {
                    !props.change1 &&
                    <>
                        <div className={styles.modified_input} style={!selected1 ? { color: "#6b7082", fontSize: "14px", fontStyle: "normal", fontWeight: "normal", fontFamily: "Roboto", letterSpacing: "normal", textAlign: "left" } : { color: "#fff" }} onClick={handleClick}> {selected1 ? selected1.toString() : "Select Tokens Ids"}</div>
                        <InputError state={errorStateToken} error="Please choose the contract first" />
                        <ModalBridge onClose={(value: any) => handleClose1(value)} show={show} title="Select TokenIDs to Bridge" id={props.id} selectedContract={props.contract} />
                    </>
                }
            </>
        )
    }
    if ((!context.bridgeregistry || accountInfo.L2.account === "") && props.id === '1') {
        return (
            <>
                <div className={styles.modified_input} style={{ color: "#6b7082", fontSize: "14px", fontStyle: "normal", fontWeight: "normal", fontFamily: "Roboto", letterSpacing: "normal", textAlign: "left" }} onClick={() => setErrorStateConnexion(true)} > Enter Address</div>
                <InputError state={errorStateConnexion} error="Please connect your Wallets first" />

            </>
        )
    }
    return (
        <></>
    )
}



export default HandleCheck