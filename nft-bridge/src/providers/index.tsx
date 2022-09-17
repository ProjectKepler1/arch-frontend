
import { ModalProvider } from './ModalProvider';
import { TransferProvider } from './TransferProvider';
import { WalletProvider } from './WalletProvider'
import { WalletsProvider } from './WalletsProvider';
import { combineProviders } from './combine-providers';
import { NftProvider } from './NftProvider/NftProvider';
import { BlockHashProvider } from './BlockProvider';
import TransactionProvider from './TransactionProvider/transactionProvider';
import { EthBlockHashProvider } from './EthBlockProvider';
import EthTransactionProvider from './EthTransactionProvider/transactionProvider';

export const AppProviders = combineProviders([
    TransferProvider,
    ModalProvider,
    WalletProvider,
    WalletsProvider,
    NftProvider,
    BlockHashProvider,
    TransactionProvider,
    EthBlockHashProvider,
    EthTransactionProvider
]);