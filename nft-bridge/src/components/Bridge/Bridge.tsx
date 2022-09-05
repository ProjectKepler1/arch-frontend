import { Flex, HStack } from '@chakra-ui/layout'
import React, { SetStateAction, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Login } from '../Login/Login'
import "@fontsource/roboto"
import BridgeDirectionOption from '../BridgeDirectionOption/BridgeDirectionOption'
import styles from './Bridge.module.scss'
import Process from '../Process/Process'
import ConfirmationScreen from '../ConfirmationScreen/ConfirmationScreen'
import { accountInfo } from '../../providers/WalletsProvider'
import Approval from '../Approval/Approval'
import { NftContext } from '../../providers/NftProvider/NftProvider'
const Bridge = ({ confirmation }: { confirmation: number }) => {
    const [active, setActive] = useState(0)
    const [contractAddress, setContractAddress] = useState('')
    const [tokenIds, setTokenIds] = useState([])
    const handleClick = useMemo(function () {
        return function (index: any) { setActive(index); }
    }, [])

    const getInfo = useCallback((contractAddress: any, tokenId: any) => {
        setContractAddress(contractAddress)
        setTokenIds(tokenId)
    }, [])
    return (
        <div className={styles.frame11143}>
            <div className={styles.frame11142}>
                <div className={styles.bridgeDirectionEthStarknet}>
                    <div style={{ width: "100%", height: '100%', cursor: 'pointer' }} onClick={() => handleClick(0)}>
                        <BridgeDirectionOption index={0} active={active} />
                    </div>
                    <div style={{ width: "100%", height: '100%', cursor: 'pointer' }} onClick={() => handleClick(1)}>
                        <BridgeDirectionOption index={1} active={active} />
                    </div>
                </div>
                {confirmation === 0 && <Process bridgeDirection={active} />}
                {confirmation === 1 && <ConfirmationScreen bridgeDirection={active} />}
                {confirmation === 2 && <Approval />}
                {/* <ConfirmationScreen /> */}
            </div>
            <Login />

        </div>
    )
}

export default Bridge