
import { useCallback } from "react";
import { ethers } from "ethers";
import { L2_ERC20_ABI } from "../abi/erc20";
import { createL2Contract } from "../utils/starknet";
import { useWeb3React } from "@web3-react/core";
import { L1BridgeContractAddress, supportedL1ChainId } from "../config/envs";
import { ChainType } from "../enums";
import { STANDARD_ERC_BRIDGE } from "../abi/immutable_abi";
import { calculateGasMargin, getHigherGWEI } from "../utils";
import { useBridgeContract } from "../hooks/useContract";

const L1BridgeAddress: string = L1BridgeContractAddress ?? ""

export const useStandardERCBridgeContract = () => {
    const { getContract } = useBridgeContract()
    const { library } = useWeb3React()

    const getImmutableContract = async () =>
        await getContract(L1BridgeAddress, STANDARD_ERC_BRIDGE);

    const deposit = async (token_L1_address: string, tokenIds: string[], sender_L2_address: string, from: string) => {
        const contract = await getImmutableContract();
        const args = [token_L1_address, tokenIds, sender_L2_address]
        const options = {
            from,
            gasPrice: getHigherGWEI(library),
            gasLimit: 0,
        };
        const gasEstimate = await contract.estimateGas[
            "deposit(address,uint256[],uint256)"
        ](...args, options);
        options.gasLimit = calculateGasMargin(gasEstimate);
        return await contract.deposit(...args, options);
    }

    const withdraw = async (token_L1_address: string, tokenIds: string[], recipient: string, from: string) => {
        const contract = await getImmutableContract();
        const args = [token_L1_address, tokenIds, recipient]
        const options = {
            from,
            gasPrice: getHigherGWEI(library),
            gasLimit: 0,
        };
        const gasEstimate = await contract.estimateGas[
            "withdraw(address,uint256[],uint256)"
        ](...args, options);
        options.gasLimit = calculateGasMargin(gasEstimate);
        return await contract.withdraw(...args, options);
    }

    const isWithdrawable = async (token_L1_address: string, tokenIds: string[], withdrawer: string, from: string) => {
        const contract = await getImmutableContract();
        const args = [token_L1_address, tokenIds, withdrawer]
        const options = {
            from,
            gasPrice: getHigherGWEI(library),
            gasLimit: 0,
        };
        const gasEstimate = await contract.estimateGas[
            "isWithdrawable(address,uint256[],uint256)"
        ](...args, options);
        options.gasLimit = calculateGasMargin(gasEstimate);
        return await contract.isWithdrawable(...args, options);
    }

    const initiateCancelDeposit = async (token_L1_address: string, tokenIds: string[], sender_L2_address: string, nonce: number, from: string) => {
        const contract = await getImmutableContract();
        const args = [token_L1_address, tokenIds, sender_L2_address, nonce]
        const options = {
            from,
            gasPrice: getHigherGWEI(library),
            gasLimit: 0,
        };
        const gasEstimate = await contract.estimateGas[
            "initiateCancelDeposit(address,uint256[],uint256,uint256)"
        ](...args, options);
        options.gasLimit = calculateGasMargin(gasEstimate);
        return await contract.initiateCancelDeposit(...args, options);
    }

    const completeCancelDeposit = async (token_L1_address: string, tokenIds: string[], sender_L2_address: string, nonce: number, recipient: string, from: string) => {
        const contract = await getImmutableContract();
        const args = [token_L1_address, tokenIds, sender_L2_address, nonce, recipient]
        const options = {
            from,
            gasPrice: getHigherGWEI(library),
            gasLimit: 0,
        };
        const gasEstimate = await contract.estimateGas[
            "completeCancelDeposit(address,uint256[],uint256,uint256,uint256)"
        ](...args, options);
        options.gasLimit = calculateGasMargin(gasEstimate);
        return await contract.initiateCancelDeposit(...args, options);
    }
}