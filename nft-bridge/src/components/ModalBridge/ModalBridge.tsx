
import React, { useState } from 'react'
import styles from './ModalBridge.module.scss'
import Registry from '../Registry/Registry'
const ModalBridge = (props: any) => {
    if (!props.show) {
        return (null)
    }
    return (
        <div className={styles.modal} onClick={() => props.onClose(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.frame11142}>
                        <div className={styles.text1}>
                            Select Contract
                        </div>
                    </div>
                    <a className={styles.close} onClick={props.onClose}></a>
                </div>
                <div className={styles.modalBody}>
                    <Registry onClose={(value: any) => props.onClose(value)} />
                </div>
            </div>
        </div>
    )
}

export default ModalBridge