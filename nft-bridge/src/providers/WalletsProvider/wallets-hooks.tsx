import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { WalletStatus } from '../../enums/WalletStatus';
import { WalletErrorType } from '../../enums/WalletErrorType';
import { ChainInfo, ChainType } from '../../enums/ChainType';
import { useEnvs } from '../../hooks/useEnvs'
import { getStarknet, getStarknetWallet, resetStarknetWallet } from '../../libs';
import { useIsL1, useTransfer } from '../TransferProvider';
import { WalletsContext } from './wallets-context';
import { NetworkType } from '../../enums/NetworkType';
interface IAccountInfo {
  account: string,
  balance: number
}
export const accountInfo: Record<string, IAccountInfo> = {
  'L1': {
    account: '',
    balance: 0
  },
  'L2': {
    account: '',
    balance: 0
  }
}
export const useWallets = () => {
  const wallets = useContext(WalletsContext);
  const { isL1 } = useTransfer();


  const connectWallet = useCallback(
    (walletConfig: any) => {
      return isL1 ? wallets.connectWalletL1(walletConfig) : wallets.connectWalletL2(walletConfig);
    },
    [isL1, wallets]
  );

  const resetWallet = useCallback(() => {
    return isL1 ? wallets.resetWalletL1() : wallets.resetWalletL2();
  }, [isL1, wallets]);

  return {
    ...(isL1 ? wallets.walletL1 : wallets.walletL2),
    connectWallet,
    resetWallet
  };
};

export const useAccountHash = () => {
  const { accountHash } = useContext(WalletsContext);
  return accountHash;
};


export const useL1Wallet = () => {
  const wallets = useContext(WalletsContext);
  const connectWallet = useCallback(
    (walletConfig: any) => wallets.connectWalletL1(walletConfig),
    [wallets]
  );

  return {
    connectWallet,
    ...wallets.walletL1
  };
};

export const useL2Wallet = () => {
  const wallets = useContext(WalletsContext);

  const connectWallet = useCallback(
    (walletConfig: any) => wallets.connectWalletL2(walletConfig),
    [wallets]
  );

  return {
    connectWallet,
    ...wallets.walletL2
  };
};

export const useStarknetWallet = () => {
  const { autoConnect, supportedL2ChainId } = useEnvs();
  const [error, setError] = useState<any>(null);
  const [account, setAccount] = useState<any>('');
  const [chainId, setChainId] = useState<any>('');
  const [chainName, setChainName] = useState('');
  const [status, setStatus] = useState(WalletStatus.DISCONNECTED);

  const connect = async (walletConfig: any) => {
    try {
      const wallet = await getStarknetWallet();
      if (!wallet) {
        return;
      }
      setStatus(WalletStatus.CONNECTING);
      let cond: any = !autoConnect && { showModal: true }
      const enabled = await wallet
        .enable(cond)
        .then(address => !!address?.length);
      if (enabled) {
        updateAccount();
        addAccountChangedListener();
        return {
          ...walletConfig,
          name: wallet.name || walletConfig.name,
          logoPath: wallet.icon || walletConfig.logoPath
        };
      }
    } catch {
      setStatus(WalletStatus.ERROR);
    }
  };

  const reset = () => {
    const disconnected = resetStarknetWallet({ clearLastWallet: true, clearDefaultWallet: true });
    if (disconnected) {
      setStatus(WalletStatus.DISCONNECTED);
      setAccount('');
    }
  };

  const addAccountChangedListener = () => {
    getStarknet().on('accountsChanged', () => {
      setStatus(WalletStatus.DISCONNECTED);
      updateAccount();
    });
  };

  const updateAccount = () => {
    const chainId: any = getCurrentChainId();
    setChainId(chainId);
    setChainName(ChainInfo.L2[chainId].NAME);
    if (chainId === supportedL2ChainId) {
      setAccount(getStarknet().selectedAddress);
      setStatus(WalletStatus.CONNECTED);
      setError(null);
    } else {
      setStatus(WalletStatus.ERROR);
      setError({ name: WalletErrorType.CHAIN_UNSUPPORTED_ERROR });
    }
  };

  const getCurrentChainId = () => {
    const { baseUrl } = getStarknet().provider;
    if (baseUrl.includes('alpha-mainnet.starknet.io')) {
      return ChainType.L2.MAIN;
    } else if (baseUrl.includes('alpha4.starknet.io')) {
      return ChainType.L2.GOERLI;
    } else if (baseUrl.match(/^https?:\/\/localhost.*/)) {
      return 'localhost';
    }
  };

  return {
    account,
    chainId,
    chainName,
    status,
    error,
    connect,
    reset,
    isConnected: getStarknet().isConnected
  };
};

export const useLoginWallet = (network: any) => {
  const walletL1 = useL1Wallet();
  const walletL2 = useL2Wallet();
  const { account, error, status, connectWallet } = network === NetworkType.L1 ? walletL1 : walletL2;
  if (network === NetworkType.L1) {
    accountInfo.L1.account = account;
  }
  else {
    accountInfo.L2.account = account;
  }

  return {
    walletAccount: account,
    walletError: error,
    walletStatus: status,
    connectWallet
  };
};

export const useWalletsStatus = () => {
  const { status: statusL1 } = useL1Wallet();
  const { status: statusL2 } = useL2Wallet();

  return {
    statusL1,
    statusL2
  };
};