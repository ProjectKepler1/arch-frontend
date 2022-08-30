import React, { useCallback, useEffect, useState } from "react"
import styles from './ConfirmationScreen.module.scss'
import { accountInfo } from "../../providers/WalletsProvider"
import { truncateAddress2, truncateAddress } from "../../utils"
import copy from '../../assets/svg/vector/copy.svg'
import Image from "next/image"
import { useTokenIds, useSelectedContractAddress, useCollectionTracker, useImageForIds } from "../../providers/NftProvider/nft-hooks"
import { supportedLiquidityProviders } from "../../config/envs"
import ethLogo from "../../assets/svg/logos/eth.png"
import Link from 'next/link'
import { web3 } from '../../libs';
import Web3 from "web3"
import { data } from "../../utils"
import { promiseHandler } from "../../utils"
const ConfirmationScreen = () => {
    const tokenIds = useTokenIds()
    const contractAddress = useSelectedContractAddress()
    const tracker = useCollectionTracker(contractAddress)
    const [showId, setShowId] = useState(false)
    const [showImage, setShowImage] = useState(false)
    const [fee, setFee] = useState(0)
    const [usdPrice, setUsdPrice] = useState<number>(0)
    const setShowIds = () => {
        setShowId(!showId)
    }
    const setShowImages = () => {
        setShowImage(!showImage)
    }

    const computeFee = async () => {
        const estimateGas = await web3.eth.estimateGas({
            to: "0x6CbC867Ec364B990Cf5FEB8Ef5547FC1A9Fed02F",
            data: data
        })
        const gasPrice = await web3.eth.getGasPrice()
        setFee(parseFloat(estimateGas) * parseFloat(gasPrice) / 1000000000000000000)
    }
    const getEthPrice = async () => {
        const [ethPrice, error] = await promiseHandler(require('eth-price'));
        if (error) {
            return Promise.reject(error);
        }
        ethPrice('usd').then((value: any) => {
            setUsdPrice(parseFloat(value[0].split(" ")[1]) * fee)
        }).catch((err: any) => {
            console.log(err);
        });
    }

    useEffect(() => {
        computeFee()
        getEthPrice()
    }, [setFee, setUsdPrice, fee])
    // const getGasAmountForContractCall = async (fromAddress: any, toAddress: any, amount: any, contractAddress: any) => {
    //     const contract = new web3.eth.Contract(ABI, contractAddress);
    //     const gasAmount = await contract.methods.transfer(toAddress, Web3.utils.toWei(`${amount}`)).estimateGas({ from: fromAddress });
    //     return gasAmount
    // }
    // const gasPrice = await web3.eth.getGasPrice();
    // getGasAmountForContractCall(accountInfo.L1.account, "0x6CbC867Ec364B990Cf5FEB8Ef5547FC1A9Fed02F", 1000, "0x6CbC867Ec364B990Cf5FEB8Ef5547FC1A9Fed02F"))


    return (
        <div className={styles.frame11144}>
            <div className={styles.frame11141}>
                <div className={styles.text1}>
                    Eth Address:
                </div>
                <div className={styles.block}>
                    <div className={styles.address1}>
                        {truncateAddress2(accountInfo.L1.account)}
                    </div>
                    <Image src={copy} onClick={() => navigator.clipboard.writeText(accountInfo.L1.account)}></Image>
                </div>
            </div>
            <div className={styles.frame11141}>
                <div className={styles.text1}>
                    Starknet Address:
                </div>
                <div className={styles.block}>
                    <div className={styles.address1}>
                        {truncateAddress(accountInfo.L2.account)}
                    </div>
                    <Image src={copy} onClick={() => navigator.clipboard.writeText(accountInfo.L2.account)} />
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
                                <img src={useImageForIds(contractAddress, id)} style={{ width: "72px" }} />
                            </div>
                            <div className={styles.span}>{id}</div>
                        </div>

                    )
                })}
                {!showImage && tokenIds.length > 3 && tokenIds.slice(0, 3).map((id: string) => {
                    return (
                        <div className={styles.frame11146}>
                            <div className={styles.image13}>
                                <img src={useImageForIds(contractAddress, id)} style={{ width: "72px" }} />
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
                                    <img src={useImageForIds(contractAddress, id)} style={{ width: "72px" }} />
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
                <Link href="/approval">
                    <button className={styles.button2}>
                        Confirm
                    </button>
                </Link>
            </div>

        </div >
    )
}
export default ConfirmationScreen