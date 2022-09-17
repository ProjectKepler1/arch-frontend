import { useCallback } from "react";
import { ethers } from "ethers";
import { L2_ERC20_ABI } from "../abi/erc20";
import { createL2Contract } from "../utils/starknet";
import { useWeb3React } from "@web3-react/core";
import { supportedL1ChainId } from "../config/envs";
import { ChainType } from "../enums";
import { web3 } from "../libs";
import { useStarknetReact } from '@web3-starknet-react/core'
import { Contract, Provider } from 'starknet'


createL2Contract

const cache: any = {};
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API;
const ALCHEMY_API_KEY_GOERLI = process.env.NEXT_PUBLIC_ALCHEMY_API_GOERLI
const isMainnet = supportedL1ChainId === ChainType.L1.MAIN
export const useContract = (abi: any, getContractHandler: any) => {
    return useCallback(
        (address: any) => {
            if (!cache[address]) {
                cache[address] = getContractHandler(address, abi);
            }
            return cache[address];
        },
        [abi, getContractHandler]
    );
};

export const useL2TokenContract = () => {
    const getContract = useContract(L2_ERC20_ABI, createL2Contract);

    return useCallback((tokenAddress: any) => getContract(tokenAddress), [getContract]);
};

// export const useBridgeContractL2 = () => {
//     const { account } = useStarknetReact()
//     console.log(account)
//     const getContractL2 = useCallback(
//         async (address: any, abi: any) => {
//             if (account) {
//                 return new Contract(abi, address, account)
//             }

//             const networkName = isMainnet ? 'mainnet-alpha' : 'goerli-alpha'
//             const provider = new Provider({ network: networkName })

//             return new Contract(abi, address, provider)
//         },
//         [account]
//     )

//     return { getContractL2 }

// }

export const useBridgeContractL2 = (abi: any, getContractHandler: any) => {
    return useCallback(
        (address: string) => {
            if (!cache[address]) {
                cache[address] = getContractHandler(address, abi);
            }
            return cache[address];
        },
        [abi, getContractHandler]
    );
};
export const useBridgeContractL1 = () => {
    const getContractL1 = useCallback(async (address: string, abi: any) => {
        const provider = new ethers.providers.JsonRpcProvider(
            isMainnet
                // ? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
                // : `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY_GOERLI}`,
                ? "https://mainnet.infura.io/v3/92c46476512549d3a34dbff7360c37de"
                : "https://goerli.infura.io/v3/92c46476512549d3a34dbff7360c37de",
            isMainnet ? 1 : 5
        );


        return new web3.eth.Contract(abi, address);
        // return new web3.eth.Contract(abi, address)


    }, [])
    return { getContractL1 }
}
