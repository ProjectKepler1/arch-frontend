import { StylesProvider } from '@chakra-ui/system'
import React from 'react'
import styles from "./TransactionStatus.module.scss"


const TransactionStatus = (props: any) => {
    return (
        <div className={styles.steps}>
            <div className={styles.title}>
                {props.title}
            </div>
            <div className={styles.frame11145}>
                <div className={styles.status}>
                    Status:
                </div>
                <div className={styles.approved}>
                    Approved
                </div>
                <div className={styles.time}>
                    23.11.2022 16:13
                </div>
            </div>
            <div className={styles.frame11145}>
                <div className={styles.txHash}>
                    Tx Hash
                </div>
                <div className={styles.address}>
                    0x345af02452541241042ba
                </div>
            </div>
        </div>

    )
}

export default TransactionStatus