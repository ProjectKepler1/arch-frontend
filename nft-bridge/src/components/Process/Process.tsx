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
import { truncateAddress } from '../../utils'
import Link from 'next/link'
import { NftContext } from '../../providers/NftProvider/NftProvider'

const Process = ({ bridgeDirection }: { bridgeDirection: number }) => {
    const [inputState, setInputState] = useState<boolean>(false)
    const [errorState, setErrorState] = useState<boolean>(false)
    const [show, setShow] = useState<boolean>(false)
    const [contract, setContract] = useState<string | null>(null)
    const [tokenId, setTokenId] = useState<string[]>([])
    // const [bridgeregistry, setBridgeRegistry] = useState<any>()
    const [change, setChange] = useState<boolean>(false)
    const [change1, setChange1] = useState<boolean>(false)
    const starknetAddress = accountInfo.L2.account
    const metaAddress = accountInfo.L1.account
    const context = useContext(NftContext)
    const [receivingAddress1, setReceivingAddress1] = useState<string | null>(null)

    // const getNFTs = useCallback(() => {
    //     const countNFTs = async (collectionAddresses: string[], owner: string) => {
    //         const firstFilteredPage = await getNFTsForOwnerFilteredByCollection('0x04FD71a7c80dee02cec42cA7C6941D0940CBf55f', collectionAddresses)
    //         setBridgeRegistry(firstFilteredPage)
    //     }
    //     if (registry) {
    //         countNFTs(registry.map(reg => reg.L1_address), metaAddress)
    //     }
    // }, [registry, setBridgeRegistry])

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
    // useEffect(() => {
    //     if (registry) getNFTs()
    // }, [registry])

    const saveChange = () => {
        context.setTokenIds(tokenId);
        context.setSelectedContractAddress(contract)
        if (!receivingAddress1 && bridgeDirection == 0)
            context.setReceivingAddress(starknetAddress)
        else if (!receivingAddress1 && bridgeDirection == 1)
            context.setReceivingAddress(metaAddress)
        else
            context.setReceivingAddress(receivingAddress1)

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
                <div className={styles.text2}>{bridgeDirection === 1 ? "Enter your Etereum Address " : "Enter your Starknet address"}</div>
                <div className={styles.subText3}>{bridgeDirection === 1 ? "Enter the receiving Ethereum Address< " : "Enter the receiving Starknet Address<"}</div>
                <div className={styles.subblock3}>
                    <div className={styles.subText2}>{bridgeDirection === 1 ? "Ethereum Address" : "Starknet Address"}</div>
                    <div className={styles.subText4} onClick={handleInputState}>{bridgeDirection === 1 ? "Use my Ethereum Address" : "Use my StarkNet Address"}</div>
                </div>
                <InputError state={errorState} error={bridgeDirection === 0 ? "Please connect your Starknet wallet first" : "Please connect your Ethereum wallet first"} />
                <ModifiedInput value={bridgeDirection === 0 ? truncateAddress(starknetAddress) : truncateAddress(metaAddress)} state={inputState} returnAddress={(value: any) => { setReceivingAddress1(value) }} bridgeDirection={bridgeDirection} />
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