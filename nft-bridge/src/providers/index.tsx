
import { ModalProvider } from './ModalProvider';
import { TransferProvider } from './TransferProvider';
import { WalletProvider } from './WalletProvider'
import { WalletsProvider } from './WalletsProvider';
import { combineProviders } from './combine-providers';
import { NftProvider } from './NftProvider/NftProvider';
export const AppProviders = combineProviders([
    TransferProvider,
    ModalProvider,
    WalletProvider,
    WalletsProvider,
    NftProvider
]);