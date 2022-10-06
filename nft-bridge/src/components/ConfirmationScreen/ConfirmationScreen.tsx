import React, { useCallback, useContext, useEffect, useState } from "react"
import styles from './ConfirmationScreen.module.scss'
import { accountInfo } from "../../providers/WalletsProvider"
import { truncateAddress2, truncateAddress, getDate } from "../../utils"
import copy from '../../assets/svg/vector/copy.svg'
import Image from "next/image"
import { useTokenIds, useSelectedContractAddress, useCollectionTracker, useImageForIds, useReceivingAddress, useStarknetCollectionTracker, useStarknetImageForIds, useTokenIdsToNumber, useSelectedContractAddress2, useStarknetNFTCollectionGroupBy, useNFTCollectionGroupBy, useTokenIdsUint } from "../../providers/NftProvider/nft-hooks"
import ethLogo from "../../assets/svg/logos/eth.png"
import Link from 'next/link'
import { getStarknet, web3 } from '../../libs';
import { data } from "../../utils"
import { promiseHandler } from "../../utils"
import { useERC721ContractL1, useERC721ContractL2 } from "../../contracts/ERC721"
import { BigNumber, ethers, providers } from "ethers"
import { useStandardERCBridgeContract, useStandardERCBridgeL2 } from "../../contracts/StandardERCBridge"
import { TransactionStatus } from "../TransactionStatus/TransactionStatus"
import { NftContext } from "../../providers/NftProvider/NftProvider"
import { useEnvs } from "../../hooks"
import { stringify } from "querystring"
import { useBlock } from "../../providers/BlockProvider"
import { useTransaction } from "../../providers/TransactionProvider"
import { stark, transaction } from "starknet"
import { useTransactionL1 } from "../../providers/EthTransactionProvider"
import circlecheck from "../../assets/svg/vector/circle-check.svg"
import no_image_icon from "../../assets/png/icons8-no-image-96.png"
import { ConnectionRejectedError } from "use-wallet"
import { useBlockEth } from "../../providers/EthBlockProvider"
import { toFelt } from "starknet/dist/utils/number"
import no_image from "../../assets/svg/vector/no-image-6663.svg"

const ConfirmationScreen = () => {
    const tokenIds = useTokenIdsToNumber()
    const tokenIdsUint = useTokenIdsUint()
    const contractAddress = useSelectedContractAddress()
    const context = useContext(NftContext)
    const receivingAddress = useReceivingAddress()
    const sendingAddress = context.sendingAddress
    const bridgeDirection = context.bridgeDirection
    const [showId, setShowId] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const [fee, setFee] = useState(0)
    const [usdPrice, setUsdPrice] = useState<number>(0)
    const [showApproval, setShowApproval] = useState<boolean>(false)
    const L1_CollectionAddress = useSelectedContractAddress()
    const otherLContractAddress = useSelectedContractAddress2()
    const { L1BridgeContractAddress, L2BridgeContractAddress } = useEnvs();
    const { addTransaction, transactionsL2 } = useTransaction()
    const { addTransactionL1, transactionsL1 } = useTransactionL1()
    const tracker = context.tracker
    const { blockNumberEth } = useBlockEth()
    const [startChecking, setStartChecking] = useState<boolean>(false)
    const [boolWithdrawable, setBoolWithdrawable] = useState<string>("false")
    const [withdrawDone, setWithdrawDone] = useState<boolean>(false)
    const ethPrice = require('eth-price');
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

    const {
        initiate_withdraw
    } = useStandardERCBridgeL2()
    const { permissionedMint,
        permissionedBurn,
        grantRoleMinter, grantRoleBurner } = useERC721ContractL2(otherLContractAddress)

    const { setApprovalForAll, estimateSetApprovalForAll } = useERC721ContractL1(contractAddress)

    const setShowIds = () => {
        setShowId(!showId)
    }
    const setShowImages = () => {
        setShowImage(!showImage)
    }
    const computeFee = async () => {
        // await setApprovalForAll(accountInfo.L1.account)
        const gas = await estimateDeposit(L1_CollectionAddress,
            tokenIds,
            receivingAddress,
            sendingAddress
        )
        const gasPrice = await web3.eth.getGasPrice();
        const eth = await ethPrice('usd');
        setFee(ethers.utils.parseUnits(gas.toString(), 'wei').toNumber() * gasPrice / 1000000000000000)
        setUsdPrice(parseInt(eth[0].slice(5, 13)) * fee)
    }
    // const computeStarkFee = async () => {
    //     try {
    //         const calldata = stark.compileCalldata({
    //             l2_token_address: contractAddress,
    //             l2_token_ids: tokenIds,
    //             l1_claimant: accountInfo.L1.account,
    //         })
    //         getStarknet().account.estimateFee({ contractAddress: L2BridgeContractAddress, entrypoint: "initiate_withdraw", calldata })
    //             .then((res: any) => console.log(res))
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    useEffect(() => {
        if (context.bridgeDirection == 0)
            computeFee()
        // else
        //     computeStarkFee()
    }, [accountInfo.L1.account])

    const handleDeposit = async () => {
        try {
            // await new Promise<void>(done => setTimeout(() => done(), 2000));
            // const tx1 = await grantRoleMinter(L2BridgeContractAddress) //grant burner role
            // await new Promise<void>(done => setTimeout(() => done(), 2000));
            // const date1 = getDate()
            // const receipt1 = await getStarknet().account.getTransactionReceipt(tx1.transaction_hash)
            // addTransaction(receipt1, "MINTER_ROLE", date1, () => { }, () => { })
            // await new Promise<void>(done => setTimeout(() => done(), 2000));
            // const tx2 = await grantRoleBurner(L2BridgeContractAddress)
            // const date2 = getDate()
            // await new Promise<void>(done => setTimeout(() => done(), 2000));
            // const receipt2 = await getStarknet().account.getTransactionReceipt(tx2.transaction_hash)
            // addTransaction(receipt2, "BURNER_ROLE", date2, () => { }, () => { })
            await setApprovalForAll(accountInfo.L1.account)
            await new Promise<void>(done => setTimeout(() => done(), 5000));
            await deposit(
                contractAddress,
                tokenIds,
                receivingAddress,
                sendingAddress,
            )

        } catch (error) {
            console.log(error)
        }

    }

    useEffect(() => {
        checkStorage()
    }, [])
    const checkStorage = () => {
        if (localStorage.getItem('Initial_contract_token')) {
            context.setTokenIds(JSON.parse(localStorage.getItem("tokenIds") ?? ''))
            context.setSendingAddress(localStorage.getItem("Sending_Address"))
            context.setSelectedContractAddress(localStorage.getItem('Initial_contract_token'))
            context.setReceivingAddress(localStorage.getItem('Receiving_Address'))
            context.setSelectedContractAddress2(localStorage.getItem("Arrival_contract_token"))
            context.setTokenImage(JSON.parse(localStorage.getItem("imageIds") ?? ''))
            context.setTracker(localStorage.getItem('Tracker'))
            context.setBridgeDirection(localStorage.getItem('Bridge_Direction'))
        }
    }
    const handleWithdrawal = async () => {
        try {
            await new Promise<void>(done => setTimeout(() => done(), 2000));
            const tx1 = await initiate_withdraw(
                contractAddress,
                tokenIdsUint,
                receivingAddress,
            )
            await new Promise<void>(done => setTimeout(() => done(), 2000));
            const date1 = getDate()
            const receipt1 = await getStarknet().account.getTransactionReceipt(tx1.transaction_hash)
            addTransaction(receipt1, "INITIATE_WITHDRAW", date1, () => { }, () => { })

        }
        catch (error) {
            console.log(error)
        }
    }
    const handleClick = () => {
        if (bridgeDirection == 0) {
            setShowApproval(true)
            handleDeposit()
        }
        else {
            setShowApproval(true)
            handleWithdrawal()
        }

    }



    const checkWithdrawable = useCallback(() => {
        const withdrawable = () => {
            isWithdrawable(
                otherLContractAddress,
                tokenIds,
                receivingAddress,
                accountInfo.L1.account
            )
                .then((result) => { setBoolWithdrawable(result.toString()) })
                .catch(console.log)

        }
        withdrawable()
    }, [])

    useEffect(() => {
        if (transactionsL2.length != 0 && transactionsL2[0].code == "ACCEPTED_ON_L1")
            checkWithdrawable()
    }, [blockNumberEth])

    useEffect(() => {
        if (boolWithdrawable == "true" && transactionsL1.length == 0) {
            setBoolWithdrawable("done")
            withdraw(
                otherLContractAddress,
                tokenIds,
                receivingAddress,
                accountInfo.L1.account)
                .then(() => console.log("Deposited on L1"))
        }
    }, [boolWithdrawable])
    // const getGasAmountForContractCall = async (fromAddress: any, toAddress: any, amount: any, contractAddress: any) => {
    //     const contract = new web3.eth.Contract(ABI, contractAddress);
    //     const gasAmount = await contract.methods.transfer(toAddress, Web3.utils.toWei(`${amount}`)).estimateGas({ from: fromAddress });
    //     return gasAmount
    // }
    // const gasPrice = await web3.eth.getGasPrice();
    // getGasAmountForContractCall(accountInfo.L1.account, L1BridgeContractAddress, 1000, L1BridgeContractAddress))


    return (
        <>
            {!showApproval &&
                <div className={styles.frame11144}>
                    <div className={styles.frame11141}>
                        <div className={styles.text1}>
                            {context.bridgeDirection == 0 ? "Eth Address" : "Starknet Address"}
                        </div>
                        <div className={styles.block}>
                            <div className={styles.address1}>
                                {truncateAddress(context.sendingAddress)}
                            </div>
                            <Image src={copy} onClick={() => navigator.clipboard.writeText(context.sendingAddress)}></Image>
                        </div>
                    </div>
                    <div className={styles.frame11141}>
                        <div className={styles.text1}>
                            {context.bridgeDirection == 0 ? "Starknet Address" : "Eth Address"}
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
                            {tracker}
                        </div>
                    </div>
                    <div className={styles.frame11145}>

                        {tokenIds.length <= 3 && tokenIds.map((id: string) => {
                            return (

                                <div className={styles.frame11146}>
                                    <div className={styles.image13}>
                                        <img src={context.imageToken ?? no_image.src} style={{ width: "72px" }} />
                                    </div>
                                    <div className={styles.span}>{id}</div>
                                </div>

                            )
                        })}
                        {!showImage && tokenIds.length > 3 && tokenIds.slice(0, 3).map((id: string) => {
                            return (
                                <div className={styles.frame11146}>
                                    <div className={styles.image13}>
                                        <img src={context.imageToken ?? no_image.src} style={{ width: "72px" }} />
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
                                            <img src={context.imageToken ?? no_image.src} style={{ width: "72px" }} />
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
                        {/* <div className={styles.conversion}> $ {usdPrice.toFixed(7)}
                        </div> */}
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

                        <button className={styles.button2} onClick={handleClick}>
                            Confirm
                        </button>
                    </div>

                </div >
            }
            {
                showApproval && context.bridgeDirection == 0 &&
                <div className={styles.frame111145}>
                    {transactionsL1.length === 2 && transactionsL1[1].code &&
                        <div className={styles.confirmation}>
                            <Image src={circlecheck} style={{ objectFit: "contain" }}></Image>

                            <div className={styles.success}>
                                Success
                            </div>
                            <div style={{ width: "70%" }}>

                                <div className={styles.finalW}>
                                    Bridged Assets can only be used in StarkNets Ecosystem
                                </div>
                            </div>
                        </div>

                    }
                    {/* <TransactionStatus title="2. Granting Minter Role " code="MINTER_ROLE" isL1={false} isStarted={transactionsL2.length != 0 && transactionsL2[0].code !== "NOT_RECEIVED"} />
                    <TransactionStatus title="Granting Burner Role" code="BURNER_ROLE" isL1={false} isStarted={transactionsL2.length >= 2 && transactionsL2[1].code !== "NOT_RECEIVED"} /> */}
                    <TransactionStatus title='Set Approval for All' code="SET_APPROVAL_FOR_ALL" isL1={true} isStarted={true} />
                    <TransactionStatus title="Deposit and migration to Starknet" code="DEPOSIT" isL1={true} isStarted={transactionsL1.length >= 1 && transactionsL1[0].code} />
                </div>
            }
            {
                showApproval && context.bridgeDirection == 1 &&
                <div className={styles.frame111145}>
                    {transactionsL2.length === 1 && transactionsL1.length != 0 && transactionsL1[0].code &&
                        <div className={styles.confirmation}>
                            <Image src={circlecheck} style={{ objectFit: "contain" }}></Image>

                            <div className={styles.success}>
                                Success
                            </div>
                            <div style={{ width: "70%" }}>

                                <div className={styles.finalW}>
                                    Bridged Assets can only be used in StarkNets Ecosystem
                                </div>
                            </div>
                        </div>

                    }
                    <TransactionStatus title="Initiate withdrawal from L2" code="INITIATE_WITHDRAW" isL1={false} isStarted={transactionsL2.length != 0 && transactionsL2[0].code !== "NOT_RECEIVED"} />
                    <TransactionStatus title="is Withdrawable ?" code="WITHDRAWABLE" isL1={true} isStarted={transactionsL2.length != 0 && transactionsL2[0].code === "ACCEPTED_ON_L1"} />
                    <TransactionStatus title="Transfer to the recipient account" code="WITHDRAW" isL1={true} isStarted={boolWithdrawable == "true" || boolWithdrawable == "done" || transactionsL1.length != 0} />
                </div>
            }
        </>
    )
}
export default ConfirmationScreen