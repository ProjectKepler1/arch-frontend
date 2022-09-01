import { ChainType } from '../enums';
import { evaluate } from '../utils/object';

export const env = process.env.NEXT_PUBLIC_REACT_APP_ENV;
export const autoConnect = process.env.NEXT_PUBLIC_REACT_APP_AUTO_CONNECT === 'true';
export const pollBlockNumberInterval = Number(process.env.REACT_APP_POLL_BLOCK_NUMBER_INTERVAL);
export const supportedL1ChainId = Number(process.env.NEXT_PUBLIC_REACT_APP_SUPPORTED_CHAIN_ID);
export const supportedL2ChainId =
  supportedL1ChainId === ChainType.L1.GOERLI ? ChainType.L2.GOERLI : ChainType.L2.MAIN;
export const starknetContractAddress = process.env.NEXT_PUBLIC_REACT_APP_STARKNET_CONTRACT_ADDRESS;
export const L1BridgeContractAddress = process.env.NEXT_PUBLIC_REACT_APP_L1_BRIDGE_CONTRACT_ADDRESS;
export const etherscanUrl = process.env.NEXT_PUBLIC_REACT_APP_ETHERSCAN_URL;
export const etherscanTxUrl = (tx: any) => evaluate(`${etherscanUrl}/tx/{{tx}}`, { tx });
export const etherscanAccountUrl = (address: any) =>
  evaluate(`${etherscanUrl}/address/{{address}}`, { address });
export const voyagerUrl = process.env.NEXT_PUBLIC_REACT_APP_VOYAGER_URL;
export const voyagerTxUrl = (tx: any) => evaluate(`${voyagerUrl}/tx/{{tx}}`, { tx });
export const voyagerAccountUrl = (contract: any) =>
  evaluate(`${voyagerUrl}/contract/{{contract}}`, { contract });
export const localStorageTransfersLogKey = process.env.REACT_APP_LOCAL_STORAGE_TRANSFERS_LOG_KEY;
export const localStorageOnboardingExpirationTimestampKey =
  process.env.REACT_APP_LOCAL_STORAGE_ONBOARDING_TIMESTAMP_KEY;
export const onboardingModalTimeoutHrs = process.env.REACT_APP_ONBOARDING_MODAL_TIMEOUT_HRS;
export const localStorageAcceptTermsKey = process.env.REACT_APP_LOCAL_STORAGE_ACCEPT_TERMS;
export const supportedLiquidityProviders =
  process.env.REACT_APP_SUPPORTED_LIQUIDITY_PROVIDERS?.split(',') || [];
