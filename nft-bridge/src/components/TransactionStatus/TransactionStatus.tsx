import { StylesProvider } from '@chakra-ui/system'
import React, { useState } from 'react'
import { transaction } from 'starknet'
import { useTransactionL1 } from '../../providers/EthTransactionProvider'
import { useTransaction } from '../../providers/TransactionProvider'
import { getDate, getEtherscanLink, getVoyagerLink, truncateAddress2 } from '../../utils'
import styles from "./TransactionStatus.module.scss"

interface Status {
    title?: string,
    code?: string,
    isL1?: boolean
    L1txHash?: string,
    isStarted?: boolean,

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
                        {status.title != "is Withdrawable ?" ? "Not received" : "Not checked yet"}
                    </div>
                    <div className={styles.time}>

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
                    <ReceiptTransaction title={status.title} state={transactionsL2[0].code} date={transactionsL2[0].date} txHash={transactionsL2[0].txHash} isL1={status.isL1} />
                )
            }
            case "BURNER_ROLE": {
                return (
                    <ReceiptTransaction title={status.title} state={transactionsL2[1].code} date={transactionsL2[1].date} txHash={transactionsL2[1].txHash} isL1={status.isL1} />
                )
            }
            case "INITIATE_WITHDRAW": {
                return (

                    <ReceiptTransaction title={status.title} state={transactionsL2[0].code} date={transactionsL2[0].date} txHash={transactionsL2[0].txHash} isL1={status.isL1} />
                )
            }
        }
    }
    if (status.isStarted && status.isL1) {

        switch (status.code) {
            case "SET_APPROVAL_FOR_ALL": {
                if (transactionsL1.length == 0) {
                    return (
                        <ReceiptTransaction title={status.title} state="Pending" date="---" isL1={status.isL1} />)
                }
                else {
                    return (
                        <ReceiptTransaction title={status.title} state={transactionsL1[0].code ? "Accepted" : "Rejected"} date={transactionsL1[0].date} txHash={transactionsL1[0].txHash} color={transactionsL1[0].code ? "#6aff52" : "red"} isL1={true} />)
                }
            }
            case "DEPOSIT": {
                if (transactionsL1.length == 1) {
                    return (
                        <ReceiptTransaction title={status.title} state="Pending" date="---" isL1={status.isL1} />)
                }
                else {
                    //A RECTIFIER
                    return (

                        <ReceiptTransaction title={status.title} state={transactionsL1[1].code ? "Accepted" : "Pending"} date={transactionsL1[1].date} txHash={transactionsL1[1].txHash} isL1={status.isL1} />
                    )
                }

            }
            case "WITHDRAWABLE": {
                if (transactionsL1.length == 0) {
                    return (

                        <ReceiptTransaction title={status.title} state="Verifying" date="---" isL1={status.isL1} />)
                }
                else {
                    return (
                        <ReceiptTransaction title={status.title} state={transactionsL1.length != 0 ? "Can withdraw" : "Cannot withdraw"} date={getDate()} isL1={status.isL1} />
                    )
                }
            }
            case "WITHDRAW": {
                if (transactionsL1.length == 0) {
                    return (

                        <ReceiptTransaction title={status.title} state="Pending" date="---" isL1={status.isL1} />)
                }
                else {
                    return (

                        <ReceiptTransaction title={status.title} state={transactionsL1[0].code ? "Approved" : "Rejected"} date={transactionsL1[0].date} txHash={transactionsL1[0].txHash} isL1={status.isL1} />
                    )
                }
            }
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
                <div className={styles.approved} style={(receipt.state === "Rejected" || receipt.state === "red") ? { color: "orange" } : (receipt.state === "Verifying" || receipt.state === "Pending") ? { color: "orange" } : { color: "#6aff52" }}>
                    {((receipt.state?.replaceAll("_", " ").charAt(0).toUpperCase() + receipt.state?.replaceAll("_", " ").slice(1).toLowerCase())).replace('l', "L")}
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
                    {receipt.txHash ? truncateAddress2(receipt.txHash) : ""}
                </a>
            </div>
        </div >
    )
}
