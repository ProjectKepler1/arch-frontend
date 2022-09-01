import { useCallback } from "react";
import { ethers } from "ethers";
import { L2_ERC20_ABI } from "../abi/erc20";
import { createL2Contract } from "../utils/starknet";
import { useWeb3React } from "@web3-react/core";
import { supportedL1ChainId } from "../config/envs";
import { ChainType } from "../enums";



createL2Contract

const cache: any = {};
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API;
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

export const useBridgeContract = () => {
    const { chainId, library } = useWeb3React();
    const getContract = useCallback(async (address: string, abi: any) => {
        if (chainId) {
            const signer = library.getSigner()
            return new ethers.Contract(address, abi, signer);
        }
        else {
            const provider = new ethers.providers.JsonRpcProvider(
                isMainnet
                    ? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`
                    : `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
                isMainnet ? 1 : 4
            );

            return new ethers.Contract(address, abi, provider);
        }

    }, [chainId, library])
    return { getContract }
}
