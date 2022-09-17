import React, { useCallback, useContext, useEffect, useState } from "react"
import styles from './ConfirmationScreen.module.scss'
import { accountInfo } from "../../providers/WalletsProvider"
import { truncateAddress2, truncateAddress } from "../../utils"
import copy from '../../assets/svg/vector/copy.svg'
import Image from "next/image"
import { useTokenIds, useSelectedContractAddress, useCollectionTracker, useImageForIds, useReceivingAddress, useStarknetCollectionTracker, useStarknetImageForIds, useTokenIdsToNumber, useSelectedContractAddress2 } from "../../providers/NftProvider/nft-hooks"
import ethLogo from "../../assets/svg/logos/eth.png"
import Link from 'next/link'
import { getStarknet, web3 } from '../../libs';
import { data } from "../../utils"
import { promiseHandler } from "../../utils"
import { useERC721ContractL1, useERC721ContractL2 } from "../../contracts/ERC721"
import { BigNumber, ethers, providers } from "ethers"
import { useStandardERCBridgeContract } from "../../contracts/StandardERCBridge"
import { TransactionStatus } from "../TransactionStatus/TransactionStatus"
import { NftContext } from "../../providers/NftProvider/NftProvider"
import { useEnvs } from "../../hooks"
import { stringify } from "querystring"
import { useBlock } from "../../providers/BlockProvider"
import { useTransaction } from "../../providers/TransactionProvider"
import { transaction } from "starknet"
import { useTransactionL1 } from "../../providers/EthTransactionProvider"

interface TxInfo {
    status: string,
    txHash: string,
    lastChecked: string,

}
const ConfirmationScreen = () => {
    const tokenIds = useTokenIdsToNumber()
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
    const L1_CollectionAddress = useSelectedContractAddress()
    const L2_CollectionAddress = useSelectedContractAddress2()
    const { L1BridgeContractAddress, L2BridgeContractAddress } = useEnvs();
    const { blockHash, blockNumber } = useBlock()
    const { addTransaction, transactionsL2 } = useTransaction()
    const { addTransactionL1, transactionsL1 } = useTransactionL1()


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

    const { permissionedMint,
        permissionedBurn,
        grantRoleMinter, grantRoleBurner } = useERC721ContractL2(L2_CollectionAddress)

    const { setApprovalForAll } = useERC721ContractL1(L1_CollectionAddress)
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

    }
    const getReceipt = (txHash: string) => {
        setTimeout(() => {
            return (getStarknet().account.getTransactionReceipt(txHash))
        }, 5000)
    }
    const getDate = () => {
        const c_date = new Date()
        const date = c_date.toLocaleDateString(undefined, { // you can use undefined as first argument
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        })
        return (date)
    }
    const handleDeposit = async () => {
        setShowApproval(true)
        try {
            // await new Promise(done => setTimeout(() => done(), 3000));
            // const tx1 = await grantRoleMinter(L2BridgeContractAddress) //grant burner role
            // await new Promise(done => setTimeout(() => done(), 3000));
            // const date1 = getDate()
            // const receipt1 = await getStarknet().account.getTransactionReceipt(tx1.transaction_hash)
            // addTransaction(receipt1, "MINTER_ROLE", date1, () => { }, () => { })
            // await new Promise(done => setTimeout(() => done(), 3000));
            // const tx2 = await grantRoleBurner(L2BridgeContractAddress)
            // const date2 = getDate()
            // await new Promise(done => setTimeout(() => done(), 3000));
            // const receipt2 = await getStarknet().account.getTransactionReceipt(tx2.transaction_hash)
            // addTransaction(receipt2, "BURNER_ROLE", date2, () => { }, () => { })
            const tx = await setApprovalForAll(accountInfo.L1.account)

            // await deposit(
            //     L1_CollectionAddress,
            //     tokenIds,
            //     receivingAddress,
            //     sendingAddress,
            //     function1
            // )
            console.log("Deposited on L1")

        } catch (error) {
            console.log(error)
        }

    }

    const handleWithdrawal = async () => {
        setShowApproval(true)
        try {
            // await initiate_withdrawal()
            // await permissionedBurn()
            // await isWithdrawable()
            // await claimWithdrawal()
        }
        catch (error) {
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
                                {context.bridgeDirection == 0 ? truncateAddress2(sendingAddress) : truncateAddress(sendingAddress)}
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
                                {context.bridgeDirection == 0 ? truncateAddress(receivingAddress) : truncateAddress2(receivingAddress)}
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
                showApproval && context.bridgeDirection == 0 &&
                <div className={styles.frame111145}>
                    <TransactionStatus title="2. Granting Minter Role " code="MINTER_ROLE" isL1={false} isStarted={transactionsL2.length != 0 && transactionsL2[0].code !== "NOT_RECEIVED"} />
                    <TransactionStatus title="Granting Burner Role" code="BURNER_ROLE" isL1={false} isStarted={transactionsL2.length >= 2 && transactionsL2[1].code !== "NOT_RECEIVED"} />
                    <TransactionStatus title='Set Approval for All' code="SET_APPROVAL_FOR_ALL" isL1={true} isStarted={transactionsL1.length != 0 && transactionsL2[1].code === "RECEIVED"} />
                    <TransactionStatus title="Deposit and migration to Starknet" code="DEPOSIT" isL1={true} isStarted={false} />
                </div>
            }
            {
                showApproval && context.bridgeDirection == 1 &&
                <div className={styles.frame111145}>
                    <TransactionStatus title="Initiate withdrawal from L2" />
                    <TransactionStatus title="Withdrawable ?" />
                    <TransactionStatus title="Transfer to the recipient account" />
                </div>
            }
        </>
    )
}
export default ConfirmationScreen