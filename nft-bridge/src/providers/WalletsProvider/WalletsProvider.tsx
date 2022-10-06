import PropTypes from 'prop-types';
import React, { useEffect, useReducer, useState, useCallback } from 'react';
import { useWallet } from 'use-wallet';
import { WalletStatus } from '../../enums';
import { calcAccountHash } from '../../utils/wallet';
import { WalletsContext } from './wallets-context';
import { accountInfo, useStarknetWallet } from './wallets-hooks';
import { actions, initialState, reducer } from './wallets-reducer';
import { getNFTsForOwnerFilteredByCollection } from "../../nft-api/Alchemy"
import registry from '../../../registry.json'

export const WalletsProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [accountHash, setAccountHash] = useState('');
  const walletL1 = useWallet();
  const walletL2 = useStarknetWallet();

  const { account: accountL1, status: statusL1, error: errorL1 } = walletL1;
  const { account: accountL2, status: statusL2, error: errorL2 } = walletL2;

  useEffect(() => {
    updateWalletL2(walletL2);
  }, [accountL2, statusL2, errorL2]);

  // useEffect(() => { if (localStorage.getItem("status") === "connected") { walletL1.connect("injected").then( setWalletConfigL1(walletConfig)) } }, []);
  // useEffect(() => { if (localStorage.getItem('statusL2') === "connected") { walletConfigL2 = JSON.parse(localStorage.getItem("WalletConfigL2")); walletL2.connect(WalletConfigL2).then(chosenWalletConfig => setWalletConfigL2(chosenWalletConfig)) } }, [])
  useEffect(() => {
    // To support serializable object in the store
    const serializedError = statusL1 === WalletStatus.ERROR ? { ...errorL1 } : null;
    updateWalletL1({
      ...walletL1,
      error: serializedError,
      isConnected: walletL1.isConnected()
    });
  }, [accountL1, statusL1, errorL1]);

  useEffect(() => {
    if (accountL1 && accountL2) {
      setAccountHash(calcAccountHash(accountL1, accountL2));
    }
  }, [accountL1, accountL2]);

  const connectWalletL1 = async (walletConfig: any) => {
    const { connectorId } = walletConfig;
    console.log(connectorId)
    return walletL1.connect('injected')
      .then(() => { localStorage.setItem("status", "connected"); setWalletConfigL1(walletConfig) });
  };

  const resetWalletL1 = () => {
    setWalletConfigL1(null)
    localStorage.setItem("status", "disconnected");
    return walletL1.reset();
  };

  const connectWalletL2 = async (walletConfig: any) => {
    console.log(walletConfig)
    localStorage.setItem("WalletConfigL2", JSON.stringify(walletConfig))
    localStorage.setItem("statusL2", "connected")
    return walletL2
      .connect(walletConfig)
      .then(chosenWalletConfig => setWalletConfigL2(chosenWalletConfig));
  };

  const resetWalletL2 = () => {
    setWalletConfigL2(null);
    localStorage.setItem('WalletConfigL2', "")
    localStorage.setItem("statusL2", "disconnected")
    return walletL2.reset();
  };

  const updateWalletL1 = (payload: any) => {
    dispatch({
      type: actions.UPDATE_WALLET_L1,
      payload
    });
  };

  const updateWalletL2 = (payload: any) => {
    dispatch({
      type: actions.UPDATE_WALLET_L2,
      payload
    });
  };

  const setWalletConfigL1 = (payload: any) => {
    dispatch({
      type: actions.SET_WALLET_CONFIG_L1,
      payload
    });
  };

  const setWalletConfigL2 = (payload: any) => {
    dispatch({
      type: actions.SET_WALLET_CONFIG_L2,
      payload
    });
  };
  const context = {
    ...state,
    accountHash,
    connectWalletL1,
    connectWalletL2,
    resetWalletL1,
    resetWalletL2,
  };

  return <WalletsContext.Provider value={context}>{children}</WalletsContext.Provider>;
};

WalletsProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};
