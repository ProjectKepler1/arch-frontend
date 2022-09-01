import React, { useState } from 'react'
import styles from './ModifiedInput.module.scss'

const ModifiedInput = (props: any) => {
    const [starknetAddress, setStarknetAddress] = useState<string>('')
    const handleChange = (e: any) => {
        setStarknetAddress(e.target.value)
        props.returnAddress(starknetAddress)
    }
    return (
        <>
            {!props.state && <input className={styles.input1} placeholder='0x00000...000000' onChange={handleChange} ></input>
            }
            {
                props.state &&
                <div className={styles.input1}>
                    {props.value}
                </div>
            }
        </>
    )
}

export default ModifiedInput