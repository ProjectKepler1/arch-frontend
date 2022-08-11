
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
        props.returnContract(value)
    }
    const handleClose1 = (value: any) => {
        setShow(false);
        setSelected1(value);
        props.returnTokenId(value)
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
                        <ModalBridge onClose={(value: any) => handleClose(value)} show={show} title="Select Contract" id={props.id} selectedContract={selected} />
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
                        <ModalBridge onClose={(value: any) => handleClose1(value)} show={show} title="Select TokenIDs to Bridge" id={props.id} selectedContract={props.contract} />
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