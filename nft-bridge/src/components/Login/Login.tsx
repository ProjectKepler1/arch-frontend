import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TransactionStatus } from '@starkware-industries/commons-js-enums';
import { ActionType } from '../../enums/ActionType';
import { ChainInfo } from '../../enums/ChainType';
import { ChainType } from '../../enums/ChainType';
import { LoginErrorType } from '../../enums/LoginErrorType'
import { NetworkType } from '../../enums/NetworkType';
import { WalletErrorType } from '../../enums/WalletErrorType';
import { WalletStatus } from '../../enums/WalletStatus';
import { useEnvs } from '../../hooks/useEnvs';
import { useLoginTracking } from '../../hooks/useTracking';
import { useWalletHandlerProvider } from '../../hooks/useWalletHandlerProvider';
import { evaluate } from '../../utils/object';
import { isChrome } from '../../utils/browser';
import Image from 'next/image';
import { parseFromDecimals, parseToUint256, promiseHandler, truncateAddress, truncateAddress2 } from '../../utils';
import { accountInfo, useLoginWallet, useWalletsStatus } from '../../providers/WalletsProvider';
const AUTO_CONNECT_TIMEOUT_DURATION = 100;
import styles from './Login.module.scss'
import starknetLogo from '../../assets/svg/logos/starknet.png'
import ethLogo from '../../assets/svg/logos/eth.png'
import ConnectWallet from '../ConnectWallet/ConnectWallet';
import MetamaskLogo from '../../assets/svg/wallets/metamask.svg'
import BraavosLogo from '../../assets/svg/wallets/Braavos.svg'
import ArgentXLogo from '../../assets/svg/wallets/ArgentX.svg'
import logInLogo from '../../assets/svg/vector/log-in.svg'
import { web3 } from '../../libs';
import { callL2Contract } from '../../utils/starknet';
import { parseFromUint256 } from '../../utils';
import { useL2TokenContract } from '../../hooks/useContract';
import Tokens from '../../config/tokens';
export const Login = (props: any) => {
    const [trackLoginScreen, trackDownloadClick, trackWalletClick, trackLoginError] =
        useLoginTracking();
    const { autoConnect, supportedL1ChainId, supportedL2ChainId } = useEnvs();
    const [selectedWalletName, setSelectedWalletName] = useState('');
    const [error, setError] = useState<any>(null);
    const [network, setNetwork] = useState(NetworkType.L1);
    const { statusL1, statusL2 } = useWalletsStatus();
    const [EthBalanceMeta, setEthBalanceMeta] = useState<number | null>(null)
    const [EthBalanceStark, setEthBalanceStark] = useState<number | null>(null)
    const { walletAccount, walletError, walletStatus, connectWallet } = useLoginWallet(network);
    const getL2TokenContract = useL2TokenContract();
    const walletHandlers = useWalletHandlerProvider(network);
    useEffect(() => {
        trackLoginScreen();
        if (!isChrome()) {
            setError({ type: LoginErrorType.UNSUPPORTED_BROWSER, message: ('Browser not supported') });
        }
    }, []);

    useEffect(() => {
        if (statusL1 !== WalletStatus.CONNECTED) {
            network !== NetworkType.L1 && setNetwork(NetworkType.L1);
        } else if (statusL2 !== WalletStatus.CONNECTED) {
            network !== NetworkType.L2 && setNetwork(NetworkType.L2);
        }
    }, [statusL1, statusL2]);

    useEffect(() => {
        let timeoutId: any;
        if (error) {
            trackLoginError(error);
        } else if (!error && autoConnect) {
            if (walletHandlers.length > 0) {
                timeoutId = setTimeout(
                    () => onWalletConnect(walletHandlers[0]),
                    AUTO_CONNECT_TIMEOUT_DURATION
                );
            }
        }
        return () => clearTimeout(timeoutId);
    }, [error, walletHandlers]);

    useEffect(() => {
        walletError && handleWalletError(walletError);
    }, [walletError]);

    const onWalletConnect = (walletHandler: any) => {
        const { config } = walletHandler;
        const { name } = config;
        trackWalletClick(name);
        if (!walletHandler.isInstalled()) {
            return walletHandler.install();
        }
        setSelectedWalletName(name);
        return connectWallet(config);
    };


    const EthBalance = useCallback(async () => {
        if (accountInfo.L1.account) {

            const [res, error] = await promiseHandler(web3.eth.getBalance(accountInfo.L1.account))
            if (error) {
                return Promise.reject(error);
            }
            setEthBalanceMeta(parseFloat((parseFloat(res) / 1000000000000000000).toFixed(7)));
        }
    }, [])

    const L2Balance = useCallback(async () => {

        const account = accountInfo.L2.account
        const tokenAddress = Tokens.L2.ETH.tokenAddress[supportedL2ChainId]
        const contract = getL2TokenContract(tokenAddress);

        const [{ balance }, error] = await promiseHandler(
            callL2Contract(contract, 'balanceOf', account, {
                blockIdentifier: TransactionStatus.PENDING.toLowerCase()
            })
        );
        if (error) {
            return Promise.reject(error);
        }
        setEthBalanceStark(parseFloat(parseFromUint256(balance).toFixed(7)))
    },
        [getL2TokenContract]
    );

    useEffect(() => {
        EthBalance()
    }, [accountInfo.L1.account, setEthBalanceMeta])

    useEffect(() => {
        L2Balance()
        props.actualisation()
    }, [accountInfo.L2.account, setEthBalanceStark])

    const handleWalletError = (error: any) => {
        if (error.name === WalletErrorType.CHAIN_UNSUPPORTED_ERROR) {
            setError({
                type: LoginErrorType.UNSUPPORTED_CHAIN_ID,
                message: evaluate('Please select {{chainName}} in your wallet', {
                    chainName: ChainInfo.L1[supportedL1ChainId].NAME
                })
            });
        }
    };


    const handleClickEth = () => {
        if (network === NetworkType.L1) {

            return walletHandlers.map((walletHandler: any) => {
                onWalletConnect(walletHandler)
            })

        }
    }
    const handleClickStark = () => {
        if (network === NetworkType.L2) {

            return walletHandlers.map((walletHandler: any) => {
                onWalletConnect(walletHandler)
            })

        }
    }
    const ConnectButton = (props: any) => {
        if (props.name === 'Ethereum') {
            return (
                <div className={network === NetworkType.L1 ? styles.walletConnectButton : styles.disabledConnectButton} onClick={handleClickEth}>
                    <div style={{ width: "24px", height: '75%', justifyContent: 'center', alignItems: 'center' }}>
                        <Image src={MetamaskLogo}></Image>
                    </div>
                    <span className={styles.connect}>{props.status === WalletStatus.CONNECTED ? "Connected" : "Connect"}</span>
                </div>
            )
        }
        else {
            return (
                <div className={network === NetworkType.L2 ? styles.walletConnectButton : styles.disabledConnectButton} onClick={handleClickStark} >
                    <div style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
                        <div style={{ flex: "50%", width: "100%", padding: "2px" }}>
                            <Image src={ArgentXLogo} objectFit="contain" ></Image>
                        </div>
                        <div style={{ flex: "50%", width: "24px", padding: "2px" }}>
                            <Image src={BraavosLogo} objectFit="contain"></Image>
                        </div>
                    </div>
                    <span className={styles.connect}>{props.status === WalletStatus.CONNECTED ? "Connected" : "Connect"}</span>
                    {/* <Image src={logInLogo} className={styles.login}></Image> */}
                </div >
            )

        }
    }
    return (
        <div className={styles.frame11143}>
            <ConnectWallet name="Ethereum"
                network="ETH"
                logoURL={ethLogo}
                type="mainnet"
                address={statusL1 === WalletStatus.CONNECTED ? truncateAddress2(accountInfo.L1.account) : "-"}
                balance={statusL1 === WalletStatus.CONNECTED ? EthBalanceMeta : '-'}
                error={network === NetworkType.L1 ? error?.message : null}>
                <ConnectButton name={"Ethereum"} status={statusL1} />
            </ConnectWallet>
            < ConnectWallet
                name="StarkNet"
                network="STARKNET"
                logoURL={starknetLogo}
                type="mainnet"
                address={statusL2 === WalletStatus.CONNECTED ? truncateAddress(accountInfo.L2.account) : "-"}
                balance={statusL2 === WalletStatus.CONNECTED ? EthBalanceStark : '-'}
                error={network === NetworkType.L2 ? error?.message : null}>
                <ConnectButton name={"StarkNet"} status={statusL2} />
            </ConnectWallet>

        </div>
    );
};
