import { useCallback } from "react";

import { L2_ERC20_ABI } from "../abi";
import { createL2Contract } from "../utils/starknet";

createL2Contract

const cache: any = {};

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