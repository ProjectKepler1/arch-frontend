import Image from 'next/image'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
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
import { promiseHandler, truncateAddress, truncateAddress2 } from '../../utils'
import Link from 'next/link'
import { NftContext } from '../../providers/NftProvider/NftProvider'
import { web3 } from '../../libs'
import { useNFTCollectionGroupBy, useStarknetNFTCollectionGroupBy } from '../../providers/NftProvider/nft-hooks'


const Process = () => {
    const [inputState, setInputState] = useState<boolean | null>(null)
    const [errorState, setErrorState] = useState<boolean | null>(null)
    const [show, setShow] = useState<boolean>(false)
    const [contract, setContract] = useState<string | null>(null)
    const [tokenId, setTokenId] = useState<string[]>([])
    // const [bridgeregistry, setBridgeRegistry] = useState<any>()
    const [change, setChange] = useState<boolean>(false)
    const [change1, setChange1] = useState<boolean>(false)
    const starknetAddress: string = accountInfo.L2.account
    const metaAddress: string = accountInfo.L1.account
    const context = useContext(NftContext)
    const [shownAddress, setShownAddres] = useState<string | null>(null)
    const [receivingAddress1, setReceivingAddress1] = useState<string | null>(null)
    const handleChange = () => {
        setChange(!change)
    }

    const handleChange1 = () => {
        setChange1(!change1)
    }
    const handleInputState = () => {
        if (context.bridgeDirection == 0 && starknetAddress === '') {
            setErrorState(true)
        }
        else if (context.bridgeDirection == 1 && metaAddress === null) {
            setErrorState(true)
        }
        else {
            setErrorState(false)
            context.bridgeDirection == 0 ? setShownAddres(truncateAddress(starknetAddress)) : setShownAddres(truncateAddress2(metaAddress))
            setInputState(true)

        }
    }

    useEffect(() => {
        setContract(null)
        setTokenId([])
        setShownAddres(null)
        setErrorState(null)
        setInputState(null)
    }, [context.bridgeDirection])

    // useEffect(() => {
    //     if (registry) getNFTs()
    // }, [registry])

    const saveChange = () => {
        localStorage.setItem("Sending_Address", context.sendingAddress)
        context.setTokenIds(tokenId);
        context.setSelectedContractAddress(contract)
        registry.map((nft: any) => {
            if (context.bridgeDirection == 0 && nft.L1_address.toLowerCase() == contract?.toLowerCase()) {

                context.setSelectedContractAddress2(nft.L2_address)
                localStorage.setItem("Arrival_contract_token", nft.L2_address)
            }
            if (context.bridgeDirection == 1 && nft.L2_address.toLowerCase() == contract?.toLowerCase()) {

                context.setSelectedContractAddress2(nft.L1_address)
                localStorage.setItem("Arrival_contract_token", nft.L1_address)
            }
        })
        if (!receivingAddress1 && context.bridgeDirection == 0) {
            context.setReceivingAddress(starknetAddress)
            localStorage.setItem("Receiving_Address", starknetAddress)
        }
        else if (!receivingAddress1 && context.bridgeDirection == 1) {
            context.setReceivingAddress(metaAddress)
            localStorage.setItem("Receiving_Address", metaAddress)
        }
        else {

            context.setReceivingAddress(receivingAddress1)
            if (receivingAddress1)
                localStorage.setItem('Receiving_Address', receivingAddress1)
        }


        if (context.bridgeDirection == 0) {
            context.setSendingAddress(metaAddress)
            localStorage.setItem("Sending_Address", metaAddress)
        }
        else if (context.bridgeDirection == 1) {
            context.setSendingAddress(starknetAddress)
            localStorage.setItem("Receiving_Address", starknetAddress)
        }

        localStorage.setItem("tokenIds",
            JSON.stringify(
                tokenId.map((id: string) => {
                    // Remove successCallback & errorCallback before stringify
                    return id
                })))
        if (contract)
            localStorage.setItem("Initial_contract_token", contract)


        localStorage.setItem('Bridge_Direction', context.bridgeDirection)

    }

    return (

        <div className={styles.frame7}>
            <div className={styles.frame11142}>
                <div className={styles.frame11142bis}>
                    <div className={styles.image12}>
                        <Image src={ethLogo} style={{ position: 'relative', width: "72px" }} />
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
                <HandleCheck contract={contract} tokenId={tokenId} change={change} change1={change1} returnContract={(value: any) => setContract(value)} returnTokenId={(value: any) => setTokenId(value)} id='1' />
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
                <HandleCheck contract={contract} tokenId={tokenId} returnContract={(value: any) => setContract(value)} returnTokenId={(value: any) => setTokenId(value)} change={change} change1={change1} id="2" />
            </div>
            <div className={styles.line4} />
            <div className={styles.bloc3}>
                <div className={styles.text2}>{context.bridgeDirection === 1 ? "Enter your Ethereum Address " : "Enter your Starknet address"}</div>
                <div className={styles.subText3}>{context.bridgeDirection === 1 ? "Enter the receiving Ethereum Address " : "Enter the receiving Starknet Address<"}</div>
                <div className={styles.subblock3}>
                    <div className={styles.subText2}>{context.bridgeDirection === 1 ? "Ethereum Address" : "Starknet Address"}</div>
                    <div className={styles.subText4} onClick={handleInputState}>{context.bridgeDirection === 1 ? "Use my Ethereum Address" : "Use my StarkNet Address"}</div>
                </div>
                <InputError state={errorState} error={context.bridgeDirection === 0 ? "Please connect your Starknet wallet first" : "Please connect your Ethereum wallet first"} />
                <ModifiedInput state={inputState} value={inputState == true ? shownAddress : undefined} returnAddress={(value: any) => { setReceivingAddress1(value) }} />
            </div>
            <div className={styles.bottom1}>
                {
                    !tokenId || !contract &&
                    <button className={styles.button3} disabled>Continue</button>
                }
                {
                    !tokenId && !contract &&
                    <button className={styles.button3} disabled>Continue</button>
                }
                {
                    !tokenId && contract &&
                    <button className={styles.button3} disabled>Continue</button>
                }
                {
                    contract != null && tokenId != null &&
                    <Link href="/confirmation">
                        <button className={styles.button3} onClick={saveChange}>Continue</button>
                    </Link>
                }
            </div>
        </div >

    )
}

export default Process