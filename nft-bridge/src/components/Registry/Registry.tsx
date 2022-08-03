
import React, { useState } from 'react'
import registry from '../../../registry.json'
import styles from './Registry.module.scss'
const Registry = (props: any) => {

    return (
        <>
            {registry && registry.map((reg: any) => {
                return (
                    <div className={styles.selector} key={reg.id} onClick={() => props.onClose(reg)} >
                        <div className={styles.frame11139}>
                            <div className={styles.text}>
                                {reg.name}
                            </div>
                            <div className={styles.subText}>
                                {reg.L1_address}
                            </div>
                        </div>
                        <div className={styles.span}>
                            2
                        </div>
                    </div>
                )
            })}
        </>
    )
}

export default Registry