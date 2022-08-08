import React from "react"
import styles from './ConfirmationScreen.module.scss'
import { accountInfo } from "../../providers/WalletsProvider"
const ConfirmationScreen = () => {
    return (
        <div className={styles.frame11144}>
            <div className={styles.frame11141}>
                <div className={styles.text1}>
                    Eth Address:
                </div>
                <div className={styles.address1}>
                    {accountInfo.L1.account}
                </div>
            </div>
            <div className={styles.frame11141}>
                <div className={styles.text1}>
                    Starknet Address:
                </div>
                <div className={styles.address1}>
                    {accountInfo.L2.account}
                </div>

            </div>
            <div className={styles.frame11141}>
                <div className={styles.text1}>
                    Token Ids:
                </div>

            </div>
            <div className={styles.frame11141}>
                <div className={styles.text1}>
                    Tracker:
                </div>

            </div>
        </div >
    )
}
export default ConfirmationScreen