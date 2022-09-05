
import { useCallback, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { L2_ERC20_ABI } from "../abi/erc20";
import { createL2Contract } from "../utils/starknet";
import { useWeb3React } from "@web3-react/core";
import { L1BridgeContractAddress, supportedL1ChainId } from "../config/envs";
import { ChainType } from "../enums";
import { STANDARD_ERC_BRIDGE } from "../abi/immutable_abi";
import { calculateGasMargin, getHigherGWEI } from "../utils";
import { useBridgeContract } from "../hooks/useContract";
import abi from "../abi/standard_erc_bridge.json"
const L1BridgeAddress: string = L1BridgeContractAddress ?? ""

export const useStandardERCBridgeContract = () => {
    const { getContract } = useBridgeContract()
    const { library } = useWeb3React()
    const [arrayDeposit, setArrayDeposit] = useState<any[]>([''])
    const [arrayWithdraw, setArrayWithdraw] = useState<any[]>([''])
    const [arrayIsWithdrawable, setArrayIsWithdrawable] = useState<any[]>([''])
    const [arrayInitiateCancelDeposit, setArrayInitiateCancelDeposit] = useState<any[]>([''])
    const [arrayCompleteCancelDeposit, setArrayCompleteCancelDeposit] = useState<any[]>([''])
    const getImmutableContract = async () =>
        await getContract(L1BridgeAddress, STANDARD_ERC_BRIDGE);

    const deposit = async (token_L1_address: BigNumber, tokenIds: BigNumber[], sender_L2_address: BigNumber, from: string, function1 = (transactionHash: string, blockNumber: any) => { }) => {
        const contract = await getImmutableContract();
        return await contract.methods.deposit(token_L1_address, tokenIds, sender_L2_address).send({ from: from }, function (error: any, transactionHash: string, blockNumber: any) {
            function1(transactionHash, blockNumber)
        });
    }

    const estimateDeposit = async (token_L1_address: string, tokenIds: BigNumber[], sender_L2_address: BigNumber, from: string): Promise<BigNumber> => {
        const contract = await getImmutableContract();
        const gasEstimate = await contract.methods.deposit(token_L1_address, tokenIds, sender_L2_address).estimateGas({ from: from });
        return gasEstimate
    }

    const withdraw = async (token_L1_address: string, tokenIds: BigNumber[], recipient: string, from: string, function1 = (transactionHash: string, blockNumber: any) => { }) => {
        const contract = await getImmutableContract();
        return await contract.methods.withdraw(token_L1_address, tokenIds, recipient).send({ from: from }, function (error: any, transactionHash: string, blockNumber: any) {
            function1(transactionHash, blockNumber)

        });
    }
    const estimateWithdraw = async (token_L1_address: string, tokenIds: BigNumber[], recipient: string, from: BigNumber) => {
        const contract = await getImmutableContract();
        const gasEstimate = await contract.methods.withdraw(token_L1_address, tokenIds, recipient).estimateGas({ from: from })
        return gasEstimate
    }
    const isWithdrawable = async (token_L1_address: string, tokenIds: BigNumber[], withdrawer: string, from: string, function1 = (transactionHash: string, blockNumber: any) => { }) => {
        const contract = await getImmutableContract();
        return await contract.methods.isWithdrawable(token_L1_address, tokenIds, withdrawer).send({ from: from }, function (error: any, transactionHash: string, blockNumber: any) {
            function1(transactionHash, blockNumber)

        });
    }
    const estimateIsWithdrawable = async (token_L1_address: string, tokenIds: BigNumber[], withdrawer: string, from: string) => {
        const contract = await getImmutableContract();
        const gasEstimate = await contract.methods.isWithdrawable(token_L1_address, tokenIds, withdrawer).estimateGas({ from: from })
        return gasEstimate
    }

    const initiateCancelDeposit = async (token_L1_address: string, tokenIds: BigNumber[], sender_L2_address: BigNumber, nonce: BigNumber, from: string, function1 = (transactionHash: string, blockNumber: any) => { }) => {
        const contract = await getImmutableContract();
        return await contract.methods.initiateCancelDeposit(token_L1_address, tokenIds, sender_L2_address, nonce).send({ from: from }, function (error: any, transactionHash: string, blockNumber: any) {
            function1(transactionHash, blockNumber)

        });
    }
    const estimateInitiateCancelDeposit = async (token_L1_address: string, tokenIds: BigNumber[], sender_L2_address: string, nonce: BigNumber, from: string) => {
        const contract = await getImmutableContract();
        const gasEstimate = await contract.methods.initiateCancelDeposit(token_L1_address, tokenIds, sender_L2_address, nonce).estimateGas({ from: from })
        return gasEstimate
    }

    const completeCancelDeposit = async (token_L1_address: string, tokenIds: BigNumber[], withdrawer: string, nonce: BigNumber, recipient: string, from: string, function1 = (transactionHash: string, blockNumber: any) => { }) => {
        const contract = await getImmutableContract();
        return await contract.methods.completeCancelDeposit(token_L1_address, tokenIds, withdrawer, nonce, recipient).send({ from: from }, function (error: any, transactionHash: string, blockNumber: any) {
            function1(transactionHash, blockNumber)

        });
    }
    const estimateCompleteCancelDeposit = async (token_L1_address: string, tokenIds: BigNumber[], withdrawer: string, nonce: BigNumber, recipient: string, from: string) => {
        const contract = await getImmutableContract();
        const gasEstimate = await contract.methods.completeCancelDeposit(token_L1_address, tokenIds, withdrawer, nonce, recipient).estimateGas({ from: from })
        return gasEstimate
    }

    return {
        deposit,
        withdraw,
        isWithdrawable,
        initiateCancelDeposit,
        completeCancelDeposit,
        estimateDeposit,
        estimateWithdraw,
        estimateIsWithdrawable,
        estimateInitiateCancelDeposit,
        estimateCompleteCancelDeposit,
    }
}