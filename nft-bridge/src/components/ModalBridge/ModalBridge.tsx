
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
                        <div className={props.title === "Select Contract" ? styles.text1 : styles.text2}>
                            {props.title}
                        </div>
                    </div>
                    <a className={styles.close} onClick={() => props.onClose(null)}></a>
                </div>
                <div className={styles.modalBody}>
                    <Registry onClose={(value: any) => props.onClose(value)} registry={props.registry} id={props.id} selectedContract={props.selectedContract} />
                </div>
            </div >
        </div>
    )
}

export default ModalBridge