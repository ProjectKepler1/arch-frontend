
import { useCallback, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { L2_ERC20_ABI } from "../abi/erc20";
import { createL2Contract } from "../utils/starknet";
import { useWeb3React } from "@web3-react/core";
import { L1BridgeContractAddress, L2BridgeContractAddress, supportedL1ChainId } from "../config/envs";
import { ChainType } from "../enums";
import { STANDARD_ERC_BRIDGE_L1 } from "../abi/immutable_abi_L1";
import { calculateGasMargin, getDate, getHigherGWEI } from "../utils";
import { useBridgeContractL1, useBridgeContractL2 } from "../hooks/useContract";
import { STANDARD_ERC_BRIDGE_L2 } from "../abi/immutable_abi_L2";
import { transaction, uint256 } from "starknet";
import { Uint256 } from "starknet/dist/utils/uint256";
import { useTransactionL1 } from "../providers/EthTransactionProvider";
const L1BridgeAddress: string = L1BridgeContractAddress ?? ""
const L2BridgeAddress: string = L2BridgeContractAddress ?? ''
interface Receipt {
    transactionHash: string,
}
export const useStandardERCBridgeContract = () => {
    const { getContractL1 } = useBridgeContractL1()
    const { addTransactionL1 } = useTransactionL1()
    var variable: boolean = false
    const getImmutableContractL1 = async () =>
        await getContractL1(L1BridgeAddress, STANDARD_ERC_BRIDGE_L1);


    const deposit = async (token_L1_address: string, tokenIds: BigNumber[], sender_L2_address: BigNumber, from: string) => {
        const contract = await getImmutableContractL1();

        return await contract.methods.deposit(token_L1_address, tokenIds, sender_L2_address).send({ from: from })
            .on('transactionHash', function (hash: string) {
                const receipt: Receipt = { transactionHash: hash }
                addTransactionL1(receipt, "DEPOSIT", getDate(), () => { }, () => { })

            })
    }

    const estimateDeposit = async (token_L1_address: string, tokenIds: BigNumber[], sender_L2_address: BigNumber, from: string): Promise<BigNumber> => {
        const contract = await getImmutableContractL1();
        const gasEstimate = await contract.methods.deposit(token_L1_address, tokenIds, sender_L2_address).estimateGas({ from: from });
        return gasEstimate
    }

    const withdraw = async (token_L1_address: string, tokenIds: BigNumber[], recipient: string, from: string) => {
        const contract = await getImmutableContractL1();
        return await contract.methods.withdraw(token_L1_address, tokenIds, recipient).send({ from: from })
            .on('transactionHash', function (hash: string) {
                const receipt: Receipt = { transactionHash: hash }
                addTransactionL1(receipt, "WITHDRAW", getDate(), () => { }, () => { })

            })
    }
    const estimateWithdraw = async (token_L1_address: string, tokenIds: BigNumber[], recipient: string, from: BigNumber) => {
        const contract = await getImmutableContractL1();
        const gasEstimate = await contract.methods.withdraw(token_L1_address, tokenIds, recipient).estimateGas({ from: from })
        return gasEstimate
    }
    const isWithdrawable = async (token_L1_address: string, tokenIds: BigNumber[], withdrawer: string, from: string) => {
        const contract = await getImmutableContractL1();
        return await contract.methods.isWithdrawable(token_L1_address, tokenIds, withdrawer).call({ from: from })
            .then(function (result: any) {
                return result
            });
    }
    const estimateIsWithdrawable = async (token_L1_address: string, tokenIds: BigNumber[], withdrawer: string, from: string) => {
        const contract = await getImmutableContractL1();
        const gasEstimate = await contract.methods.isWithdrawable(token_L1_address, tokenIds, withdrawer).estimateGas({ from: from })
        return gasEstimate
    }

    const initiateCancelDeposit = async (token_L1_address: string, tokenIds: BigNumber[], sender_L2_address: BigNumber, nonce: BigNumber, from: string, function1 = (transactionHash: string, blockNumber: any) => { }) => {
        const contract = await getImmutableContractL1();
        return await contract.methods.initiateCancelDeposit(token_L1_address, tokenIds, sender_L2_address, nonce).send({ from: from }, function (error: any, transactionHash: string, blockNumber: any) {
            function1(transactionHash, blockNumber)

        });
    }
    const estimateInitiateCancelDeposit = async (token_L1_address: string, tokenIds: BigNumber[], sender_L2_address: string, nonce: BigNumber, from: string) => {
        const contract = await getImmutableContractL1();
        const gasEstimate = await contract.methods.initiateCancelDeposit(token_L1_address, tokenIds, sender_L2_address, nonce).estimateGas({ from: from })
        return gasEstimate
    }

    const completeCancelDeposit = async (token_L1_address: string, tokenIds: BigNumber[], withdrawer: string, nonce: BigNumber, recipient: string, from: string, function1 = (transactionHash: string, blockNumber: any) => { }) => {
        const contract = await getImmutableContractL1();
        return await contract.methods.completeCancelDeposit(token_L1_address, tokenIds, withdrawer, nonce, recipient).send({ from: from }, function (error: any, transactionHash: string, blockNumber: any) {
            function1(transactionHash, blockNumber)

        });
    }
    const estimateCompleteCancelDeposit = async (token_L1_address: string, tokenIds: BigNumber[], withdrawer: string, nonce: BigNumber, recipient: string, from: string) => {
        const contract = await getImmutableContractL1();
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

export const useStandardERCBridgeL2 = () => {
    const getImmutableContractL2 = async () =>
        await createL2Contract(L2BridgeAddress, STANDARD_ERC_BRIDGE_L2)

    const initiate_withdraw = async (l2_token_address: BigNumber, l2_token_ids: BigNumber[], l1_claimant: BigNumber) => {
        const contract = await getImmutableContractL2()
        return await contract.invoke("initiate_withdraw", [l2_token_address, l2_token_ids, l1_claimant])
    }
    return {
        initiate_withdraw
    }

}