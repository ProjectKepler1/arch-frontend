import React, { useState } from 'react'
import styles from "./Approval.module.scss"
import { TransactionStatus } from '../TransactionStatus/TransactionStatus'
import { useReceivingAddress, useSelectedContractAddress, useTokenIds } from '../../providers/NftProvider/nft-hooks'
import { accountInfo } from '../../providers/WalletsProvider'
import { useStandardERCBridgeContract } from '../../contracts/StandardERCBridge'
import { web3 } from '../../libs'
import { BigNumber } from 'ethers'
import { useERC721Contract } from '../../contracts/ERC721'

const Approval = () => {
    const { deposit, withdraw, isWithdrawable, initiateCancelDeposit, completeCancelDeposit } = useStandardERCBridgeContract()
    const L1_CollectionAddress = useSelectedContractAddress()
    const { setApprovalForAll } = useERC721Contract(L1_CollectionAddress)
    const tokenIds = useTokenIds()
    const L1_CollectionAddress_BN = BigNumber.from(useSelectedContractAddress())
    const L2_Sender_BN = BigNumber.from(useReceivingAddress())
    const L1_Sender_BN = accountInfo.L1.account
    const [depositError, setDepositError] = useState<string>("")


    return (
        <div className={styles.frame11145}>
            <TransactionStatus title="2. Deposit" />
            <TransactionStatus title="Approve Bridged tokens" />
            <TransactionStatus title="Bridge Locked Tokens on Ethereum" />
            <TransactionStatus title="Block Comfirmations" />
        </div>
    )
}

export default Approval