
import React, { useState } from 'react'
import ModalBridge from '../ModalBridge/ModalBridge'
import Registry from '../Registry/Registry'
import styles from './HandleCkech.module.scss'
const HandleCheck = (props: any) => {
    const [show, setShow] = useState(false)
    const [selected, setSelected] = useState<any>(null)
    const [selected1, setSelected1] = useState<any>(null)
    const handleClose = (value: any) => {
        setShow(false);
        setSelected(value);
    }

    if (props.id === '1') {
        return (
            <>
                {
                    props.change &&
                    <input className={styles.input1} placeholder='Enter Address'></input>
                }
                {
                    !props.change &&
                    <>
                        <input className={styles.input0} placeholder={selected === null ? 'Enter Address' : selected} onClick={() => setShow(true)}></input>
                        <ModalBridge onClose={(value: any) => handleClose(value)} show={show} registry={props.registry} title="Select Contract" id={props.id} />
                    </>
                }
            </>)
    }
    if (props.id === '2') {
        return (
            <>
                {
                    props.change1 &&
                    <>
                        <input className={styles.input1} placeholder='Tokens IDs'></input>
                        <input className={styles.input1} placeholder='Tokens IDs'></input>
                    </>
                }
                {
                    !props.change1 &&
                    <>
                        <input className={styles.input0} placeholder={selected1 === null ? 'Select Tokens IDs' : selected1} onClick={() => setShow(true)}></input>
                        <ModalBridge onClose={(value: any) => handleClose(value)} show={show} registry={props.registry} title="Select TokensIDs to Bridge" id={props.id} />
                    </>
                }
            </>
        )
    }
    return (
        <></>
    )
}



export default HandleCheck