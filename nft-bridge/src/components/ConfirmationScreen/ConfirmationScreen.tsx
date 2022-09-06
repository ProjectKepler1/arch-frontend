import React, { useCallback, useContext, useEffect, useState } from "react"
import styles from './ConfirmationScreen.module.scss'
import { accountInfo } from "../../providers/WalletsProvider"
import { truncateAddress2, truncateAddress } from "../../utils"
import copy from '../../assets/svg/vector/copy.svg'
import Image from "next/image"
import { useTokenIds, useSelectedContractAddress, useCollectionTracker, useImageForIds, useReceivingAddress, useStarknetCollectionTracker, useStarknetImageForIds } from "../../providers/NftProvider/nft-hooks"
import { L1BridgeContractAddress, supportedLiquidityProviders } from "../../config/envs"
import ethLogo from "../../assets/svg/logos/eth.png"
import Link from 'next/link'
import { web3 } from '../../libs';
import { data } from "../../utils"
import { promiseHandler } from "../../utils"
import { useERC721Contract } from "../../contracts/ERC721"
import { BigNumber, ethers } from "ethers"
import { useStandardERCBridgeContract } from "../../contracts/StandardERCBridge"
import TransactionStatus from "../TransactionStatus/TransactionStatus"
import { NftContext } from "../../providers/NftProvider/NftProvider"
const ConfirmationScreen = () => {
    const tokenIds = useTokenIds()
    const contractAddress = useSelectedContractAddress()
    const context = useContext(NftContext)
    const receivingAddress = useReceivingAddress()
    const tracker = context.bridgeDirection == 0 ? useCollectionTracker(contractAddress) : useStarknetCollectionTracker(contractAddress)
    const sendingAddress = context.bridgeDirection == 0 ? accountInfo.L1.account : accountInfo.L2.account


    const [showId, setShowId] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const [fee, setFee] = useState(0)
    const [usdPrice, setUsdPrice] = useState<number>(0)
    const [showApproval, setShowApproval] = useState<boolean>(false)
    const [transactionHash, setTransactionHash] = useState<string>('')
    const [blockNumber, setBlockNumber] = useState<any>()
    const { deposit,
        withdraw,
        isWithdrawable,
        initiateCancelDeposit,
        completeCancelDeposit,
        estimateDeposit,
        estimateWithdraw,
        estimateIsWithdrawable,
        estimateInitiateCancelDeposit,
        estimateCompleteCancelDeposit,
    } = useStandardERCBridgeContract()
    const L1_CollectionAddress = useSelectedContractAddress()
    const { setApprovalForAll } = useERC721Contract(L1_CollectionAddress)
    const L1_CollectionAddress_BN = BigNumber.from(L1_CollectionAddress)
    const L2_Sender_BN = BigNumber.from(useReceivingAddress())
    const L1_Sender_BN = accountInfo.L1.account
    const [depositError, setDepositError] = useState<string>("")

    const setShowIds = () => {
        setShowId(!showId)
    }
    const setShowImages = () => {
        setShowImage(!showImage)
    }
    const computeFee = async () => {
        // const gas = await estimateDeposit(L1_CollectionAddress,
        //     tokenIds,
        //     L2_Sender_BN,
        //     accountInfo.L1.account
        // )
        // setFee(ethers.utils.parseUnits(gas.toString(), 'wei').toNumber())

    }
    const function1 = (transactionHash: string, blockNumber: any) => {
        setTransactionHash(transactionHash)
        setBlockNumber(blockNumber)
    }
    const handleDeposit = async () => {
        setShowApproval(true)
        try {
            await setApprovalForAll(
                L1_CollectionAddress
            )
            await deposit(
                L1_CollectionAddress,
                tokenIds,
                L2_Sender_BN,
                sendingAddress,
                function1
            )

        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        computeFee()
    }, [setFee, setUsdPrice, fee])
    // const getGasAmountForContractCall = async (fromAddress: any, toAddress: any, amount: any, contractAddress: any) => {
    //     const contract = new web3.eth.Contract(ABI, contractAddress);
    //     const gasAmount = await contract.methods.transfer(toAddress, Web3.utils.toWei(`${amount}`)).estimateGas({ from: fromAddress });
    //     return gasAmount
    // }
    // const gasPrice = await web3.eth.getGasPrice();
    // getGasAmountForContractCall(accountInfo.L1.account, "0x6CbC867Ec364B990Cf5FEB8Ef5547FC1A9Fed02F", 1000, "0x6CbC867Ec364B990Cf5FEB8Ef5547FC1A9Fed02F"))


    return (
        <>
            {!showApproval &&
                <div className={styles.frame11144}>
                    <div className={styles.frame11141}>
                        <div className={styles.text1}>
                            {context.bridgeDirection === 0 ? "Eth Address" : "Starknet Address"}
                        </div>
                        <div className={styles.block}>
                            <div className={styles.address1}>
                                {truncateAddress2(sendingAddress)}
                            </div>
                            <Image src={copy} onClick={() => navigator.clipboard.writeText(sendingAddress)}></Image>
                        </div>
                    </div>
                    <div className={styles.frame11141}>
                        <div className={styles.text1}>
                            {context.bridgeDirection === 0 ? "Starknet Address" : "Eth Address"}
                        </div>
                        <div className={styles.block}>
                            <div className={styles.address1}>
                                {truncateAddress(receivingAddress)}
                            </div>
                            <Image src={copy} onClick={() => navigator.clipboard.writeText(receivingAddress)} />
                        </div>
                    </div>
                    <div className={styles.frame11141}>
                        <div className={styles.text1}>
                            Token Ids:
                        </div>
                        {
                            tokenIds.length <= 5 && <div className={styles.address1}>
                                {tokenIds.toString()}
                            </div>
                        }

                        {
                            tokenIds.length > 5 && !showId &&
                            <>
                                <div className={styles.address1}>
                                    {tokenIds.slice(0, 5).toString()},
                                    <div className={styles.text1}>
                                        +{tokenIds.length - 5}
                                    </div>
                                    <div className={styles.address1} style={{ color: "#57c6e4", cursor: "pointer" }} onClick={setShowIds}>
                                        View All
                                    </div>
                                </div>

                            </>
                        }
                        {
                            tokenIds.length > 3 && showId &&
                            <>
                                <div className={styles.address1}>
                                    <div style={{ wordBreak: "break-all", display: "flex", width: '200px', whiteSpace: "nowrap" }}>
                                        {tokenIds.toString()}
                                    </div>
                                    <div className={styles.address1} style={{ color: "#57c6e4", cursor: "pointer" }} onClick={setShowIds}>
                                        Hide
                                    </div>
                                </div>
                            </>
                        }

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

                        {tokenIds.length <= 3 && tokenIds.map((id: string) => {
                            return (

                                <div className={styles.frame11146}>
                                    <div className={styles.image13}>
                                        <img src={context.bridgeDirection == 0 ? useImageForIds(contractAddress, id) : useStarknetImageForIds(contractAddress, id)} style={{ width: "72px" }} />
                                    </div>
                                    <div className={styles.span}>{id}</div>
                                </div>

                            )
                        })}
                        {!showImage && tokenIds.length > 3 && tokenIds.slice(0, 3).map((id: string) => {
                            return (
                                <div className={styles.frame11146}>
                                    <div className={styles.image13}>
                                        <img src={context.bridgeDirection == 0 ? useImageForIds(contractAddress, id) : useStarknetImageForIds(contractAddress, id)} style={{ width: "72px" }} />
                                    </div>
                                    <div className={styles.span}>{id}</div>
                                </div>
                            )

                        })
                        }
                        {!showImage && tokenIds.length > 3 &&
                            <div className={styles.image11} style={{ backgroundColor: "#212636", justifyContent: "center", alignItems: "center", display: "flex", cursor: "pointer" }} onClick={setShowImages}>
                                <div className={styles.text3}>
                                    +{tokenIds.length - 3}
                                </div>
                            </div>
                        }
                        {
                            showImage && tokenIds.length > 3 && tokenIds.map((id: string) => {
                                return (
                                    <div className={styles.frame11146}>
                                        <div className={styles.image13}>
                                            <img src={context.bridgeDirection == 0 ? useImageForIds(contractAddress, id) : useStarknetImageForIds(contractAddress, id)} style={{ width: "72px" }} />
                                        </div>
                                        <div className={styles.span}>{id}</div>
                                    </div>
                                )

                            })
                        }
                        {showImage && tokenIds.length > 3 &&
                            <div className={styles.image11} style={{ backgroundColor: "#212636", justifyContent: "center", alignItems: "center", display: "flex", cursor: "pointer" }} onClick={setShowImages}>
                                <div className={styles.text3}>
                                    --
                                </div>
                            </div>
                        }
                    </div>
                    <div className={styles.line4} />
                    <div className={styles.frame11148}>
                        <div className={styles.frame2}>

                            <div className={styles.text1}>
                                Network Fee (Total):
                            </div>
                            <div className={styles.eth}>
                                {fee} ETH
                            </div>
                        </div>
                        <div className={styles.conversion}> $ {usdPrice.toFixed(7)}
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
                        <button className={styles.button2} onClick={handleDeposit}>
                            Confirm
                        </button>
                    </div>

                </div >
            }
            {
                showApproval &&
                <div className={styles.frame111145}>
                    <TransactionStatus title="2. Approve Bridge Contract" />
                    <TransactionStatus title="Deposit" />
                    <TransactionStatus title="Mint to the desired Starknet Contract" />
                </div>
            }
        </>
    )
}
export default ConfirmationScreen