import React, { useContext, useState } from 'react'
import styles from "./MultiInput.module.scss"
import fi_x from "../../assets/svg/vector/fi_x.svg"
import Image from 'next/image'
import check from '../../assets/svg/vector/check-svgrepo-com.svg'
import { useIsTokenInCollection2, useIsTokenInStarkCollection2, useNFTCollectionGroupBy, useStarknetNFTCollectionGroupBy } from '../../providers/NftProvider/nft-hooks'
import InputError from '../ErrorState/InputError'
import { NftContext } from '../../providers/NftProvider/NftProvider'
const MultiInput = (props: any) => {
    const [formValue, setFormValue] = useState<any>([''])
    const [error, setError] = useState<boolean | null>(null)
    const [errorState, setErrorState] = useState<any>([''])
    const context = useContext(NftContext)
    const groupByCollection = context.bridgeDirection == 0 ? useNFTCollectionGroupBy() : useStarknetNFTCollectionGroupBy()

    const removeField = (index: number) => {
        let newFormValue = [...formValue]
        let newErrorState = [...errorState]
        newFormValue.splice(index, 1)
        newErrorState.splice(index, 1)
        setFormValue(newFormValue)
        setErrorState(newErrorState)

    }
    const addField = () => {
        setFormValue([...formValue, ''])
    }
    const checkValidToken = (index: number, e: any) => {
        const tokenId = e.target.value
        if (context.bridgeDirection == 0) {
            if (!useIsTokenInCollection2(groupByCollection, tokenId, props.address)) {
                let newFormValue = [...formValue]
                let newErrorState = [...errorState]
                newFormValue[index] = tokenId
                newErrorState[index] = true
                setFormValue(newFormValue)
                setErrorState(newErrorState)
            }
            else {
                let newFormValue = [...formValue]
                let newErrorState = [...errorState]
                newFormValue[index] = tokenId
                newErrorState[index] = false
                setFormValue(newFormValue)
                setErrorState(newErrorState)
            }
        }
        else {
            if (!useIsTokenInStarkCollection2(groupByCollection, tokenId, props.address)) {
                let newFormValue = [...formValue]
                let newErrorState = [...errorState]
                newFormValue[index] = tokenId
                newErrorState[index] = true
                setFormValue(newFormValue)
                setErrorState(newErrorState)
            }
            else {
                let newFormValue = [...formValue]
                let newErrorState = [...errorState]
                newFormValue[index] = tokenId
                newErrorState[index] = false
                setFormValue(newFormValue)
                setErrorState(newErrorState)
            }
        }
    }

    const handleSubmit = () => {
        if (errorState.includes(true)) {
            setError(true)
        }
        else {
            props.onSelect(formValue.filter((item: string) => item !== ""))
            setError(false)
        }
    }
    return (
        <>
            {
                !props.state &&
                formValue.map((element: any, index: number) => {
                    return (
                        <div key={index}>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <input className={styles.otherInput} placeholder='Tokens IDs' onChange={(e: any) => checkValidToken(index, e)} value={element} />
                                {
                                    index ?
                                        <Image src={fi_x} onClick={() => removeField(index)} style={{ cursor: "pointer" }} /> : null
                                }
                            </div>
                            <InputError state={errorState[index]} error="Token Id not valid for the selected address" />
                        </div>
                    )
                })
            }
            {
                props.state &&
                <div >
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <input className={styles.otherInput} style={{ pointerEvents: 'none' }} placeholder='Tokens IDs' />
                    </div>
                    <InputError state={true} error="Please choose the contract first" />
                </div>

            }
            <div style={{ display: "flex", flexDirection: "row" }}>
                <button className={styles.subText4} onClick={addField} > Add Tokens Ids</button >
                <button className={styles.submit} onClick={handleSubmit}>Confirm</button>
                {
                    error === false &&
                    <Image src={check}></Image>
                }
            </div>
            <InputError state={error} error="Please insert valid token Ids" />
        </>

    )

}

export default MultiInput