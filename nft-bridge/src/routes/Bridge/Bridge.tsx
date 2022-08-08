import { Flex, HStack } from '@chakra-ui/layout'
import React, { useMemo, useState } from 'react'
import { Login } from '../Login/Login'
import "@fontsource/roboto"
import BridgeDirectionOption from '../../components/BridgeDirectionOption/BridgeDirectionOption'
import styles from './Bridge.module.scss'
import Process from '../../components/Process/Process'
import ConfirmationScreen from '../../components/ConfirmationScreen/ConfirmationScreen'


const Bridge = () => {
    const [active, setActive] = useState(0)
    const handleClick = useMemo(function () {
        return function (index: any) { setActive(index) }
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
                <Process />
                {/* <ConfirmationScreen /> */}
            </div>
            <Login />

        </div>
    )
}

export default Bridge