import { createContext } from 'react';

import { initialState } from './wallets-reducer';


export const WalletsContext = createContext({
  ...initialState,
  accountHash: '',
  connectWalletL1: (config: any) => { },
  connectWalletL2: (config: any) => { },
  resetWalletL1: () => { },
  resetWalletL2: () => { },
});
