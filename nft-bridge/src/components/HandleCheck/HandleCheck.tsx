
import React, { useState } from 'react'
import ModalBridge from '../ModalBridge/ModalBridge'
import Registry from '../Registry/Registry'
import styles from './HandleCkech.module.scss'
const HandleCheck = (props: any) => {
    const [show, setShow] = useState(false)
    const [selected, setSelected] = useState<any>(null)
    const handleClose = (value: any) => {
        setShow(false);
        setSelected(value);
    }
    return (
        <>
            {
                props.change &&
                <input className={styles.input1} placeholder='Enter Address'></input>
            }
            {
                !props.change &&
                <>
                    <input className={styles.input0} placeholder={selected === null ? 'Enter Address' : selected.L1_address} onClick={() => setShow(true)}></input>
                    <ModalBridge onClose={(value: any) => handleClose(value)} show={show} />
                </>
            }
        </>

    )
}



export default HandleCheck