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
import { useBridgeDirection, useSetBridgeDirection } from '../../providers/NftProvider/nft-hooks'
import { useBridgeContract } from '../../hooks/useContract'
const Bridge = ({ confirmation }: { confirmation: number }) => {
    const [contractAddress, setContractAddress] = useState('')
    const [tokenIds, setTokenIds] = useState([])
    const context = useContext(NftContext)
    const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void
    const handleClick = useMemo(function () {
        return function (index: any) {
            if (confirmation === 0) {
                context.setBridgeDirection(index)
            }

        }
    }, [])
    const getInfo = useCallback((contractAddress: any, tokenId: any) => {
        setContractAddress(contractAddress)
        setTokenIds(tokenId)
    }, [])

    return (
        <div className={styles.frame11143}>
            <div className={styles.frame11142}>
                <div className={styles.bridgeDirectionEthStarknet}>
                    <div style={context.bridgeDirection == 1 && confirmation == 1 ? { width: "100%", height: '100%', cursor: 'not-allowed' } : { width: "100%", height: '100%', cursor: 'pointer' }} onClick={() => handleClick(0)}>
                        <BridgeDirectionOption index={0} active={context.bridgeDirection} />
                    </div>
                    <div style={context.bridgeDirection == 0 && confirmation == 1 ? { width: "100%", height: '100%', cursor: 'not-allowed' } : { width: "100%", height: '100%', cursor: 'pointer' }} onClick={() => handleClick(1)}>
                        <BridgeDirectionOption index={1} active={context.bridgeDirection} />
                    </div>
                </div>
                {confirmation === 0 && <Process />}
                {confirmation === 1 && <ConfirmationScreen />}
            </div>
            <Login actualisation={forceUpdate} />

        </div>
    )
}

export default Bridge