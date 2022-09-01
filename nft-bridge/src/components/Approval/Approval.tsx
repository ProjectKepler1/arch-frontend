import React from 'react'
import styles from "./Approval.module.scss"
import TransactionStatus from '../TransactionStatus/TransactionStatus'
const Approval = () => {
    return (
        <div className={styles.frame11145}>
            <TransactionStatus title="2. Deposit" />
            <TransactionStatus title="Approve Bridged tokens" />
            <TransactionStatus title="Bridge Locked Tokens on Ethereum " />
            <TransactionStatus title="Block Comfirmations" />
        </div>
    )
}

export default Approval