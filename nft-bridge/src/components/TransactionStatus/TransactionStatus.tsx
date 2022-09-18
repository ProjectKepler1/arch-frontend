import { StylesProvider } from '@chakra-ui/system'
import React, { useState } from 'react'
import { transaction } from 'starknet'
import { useTransactionL1 } from '../../providers/EthTransactionProvider'
import { useTransaction } from '../../providers/TransactionProvider'
import { getEtherscanLink, getVoyagerLink, truncateAddress2 } from '../../utils'
import styles from "./TransactionStatus.module.scss"

interface Status {
    title?: string,
    code?: string,
    isL1?: boolean
    L1txHash?: string,
    isStarted?: boolean

}

interface Receipt {
    title?: string,
    state?: string,
    date?: string,
    txHash?: string,
    isL1?: boolean,
    color?: string
}
export const TransactionStatus = (status: Status) => {
    const { transactionsL2 } = useTransaction()
    const { transactionsL1 } = useTransactionL1()
    if (!status.isStarted) {
        return (
            <div className={styles.steps}>
                <div className={styles.title}>
                    {status.title}
                </div>
                <div className={styles.frame11145}>
                    <div className={styles.status}>
                        Status:
                    </div>
                    <div className={styles.approved} style={{ color: "red" }}>
                        Not received
                    </div>
                    <div className={styles.time}>
                        ---
                    </div>
                </div>
                <div className={styles.frame11145}>
                    <div className={styles.txHash}>
                        Tx Hash
                    </div>
                    <div className={styles.address}>
                        ---
                    </div>
                </div>
            </div>
        )
    }
    if (status.isStarted && !status.isL1) {
        switch (status.code) {
            case "MINTER_ROLE": {
                return (
                    <ReceiptTransaction title={status.title} state={transactionsL2[0].code} date={transactionsL2[0].date} txHash={transactionsL2[0].txHash} />
                )
            }
            case "BURNER_ROLE": {
                return (
                    <ReceiptTransaction title={status.title} state={transactionsL2[1].code} date={transactionsL2[1].date} txHash={transactionsL2[1].txHash} />
                )
            }
        }
    }
    if (status.isStarted && status.isL1) {

        switch (status.code) {
            case "SET_APPROVAL_FOR_ALL": {
                if (transactionsL1.length == 0) {
                    return (
                        <ReceiptTransaction title={status.title} state="PENDING" date="---" txHash="---" />)
                }
                else {
                    return (
                        <ReceiptTransaction title={status.title} state={transactionsL1[0].code ? "ACCEPTED" : "REJECTED"} date={transactionsL1[0].date} txHash={transactionsL1[0].txHash} color={transactionsL1[0].code ? "#6aff52" : "red"} isL1={true} />)
                }
            }
            // case "DEPOSIT": {
            //     <ReceiptTransaction title={status.title} state={transactionsL1[1].code} date={transactionsL1[1].date} txHash={transactionsL1[1].txHash} />

            // }
        }
    }
    return (<></>)
}

const ReceiptTransaction = (receipt: Receipt) => {
    return (
        <div className={styles.steps}>
            <div className={styles.title}>
                {receipt.title}
            </div>
            <div className={styles.frame11145}>
                <div className={styles.status}>
                    Status:
                </div>
                <div className={styles.approved} style={(receipt.state === "ACCEPTED_ON_L2" || receipt.state === "ACCEPTED") ? { color: "#6aff52" } : { color: "orange" }}>
                    {receipt.state}
                </div>
                <div className={styles.time}>
                    {receipt.date}
                </div>
            </div>
            <div className={styles.frame11145}>
                <div className={styles.txHash}>
                    Tx Hash
                </div>
                <a className={styles.address} href={receipt.isL1 ? getEtherscanLink(receipt.txHash) : getVoyagerLink(receipt.txHash)} target="_blank" style={{ cursor: "pointer" }}>
                    {truncateAddress2(receipt.txHash)}
                </a>
            </div>
        </div >
    )
}
