import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "ethers"
import { getContractAddress } from "ethers/lib/utils"
import { feeTransactionVersion } from "starknet/dist/utils/hash"
import { hexToDecimalString, toBN, toFelt } from "starknet/dist/utils/number"
import { ERC721_STARKNET_ABI, ERC721_TOKEN_MOCK_ABI } from "../abi/erc721"
import { L1BridgeContractAddress } from "../config/envs"
import { useBridgeContractL1, useBridgeContractL2 } from "../hooks/useContract"
import { getStarknet, starknet } from "../libs"
import { getDate, getHigherGWEI } from "../utils"
import { createL2Contract } from "../utils/starknet"
import { Account } from "starknet"
import { accountInfo } from "../providers/WalletsProvider"
import { useTransactionL1 } from "../providers/EthTransactionProvider"


export const useERC721ContractL1 = (L1_CollectionAddress: string) => {
    const { getContractL1 } = useBridgeContractL1()
    const { addTransactionL1 } = useTransactionL1()
    const getERC721Contract = async () =>
        await getContractL1(L1_CollectionAddress, ERC721_TOKEN_MOCK_ABI);

    const setApprovalForAll = async (from: string) => {
        const contract = await getERC721Contract();
        return await contract.methods.setApprovalForAll(L1BridgeContractAddress, true).send({ from: from })
            .then(function (receipt: any) {
                addTransactionL1(receipt, "SET_APPROVAL_FOR_ALL", getDate(), () => { }, () => { })
            });

    }

    const estimateSetApprovalForAll = async (from: string) => {
        const contract = await getERC721Contract()
        return await contract.methods.setApprovalForAll(L1BridgeContractAddress, true).estimateGas({ from: from })
    }


    return {
        setApprovalForAll, estimateSetApprovalForAll
    }
}


export const useERC721ContractL2 = (L2_CollectionAddress: string) => {
    const getERC721Contract = async () =>
        await createL2Contract(L2_CollectionAddress, ERC721_STARKNET_ABI)

    const permissionedMint = async (from: string, tokenId: BigNumber) => {
        const contract = await getERC721Contract()
        return await contract.invoke("permissionedMint", [from, tokenId])
    }
    const permissionedBurn = async (from: string, tokenId: BigNumber) => {
        const contract = await getERC721Contract()
        return await contract.invoke("permissionedBurn", [from, tokenId])
    }
    const grantRoleMinter = async (account?: string) => {

        const contract = await getERC721Contract()
        const { res } = await contract.call("getMinterRole");
        return await contract.invoke("grantRole", [res, account])

    }
    const grantRoleBurner = async (account?: string) => {
        const contract = await getERC721Contract()
        const { res } = await contract.call("getBurnerRole")
        return await contract.invoke("grantRole", [res, account])
    }
    return {
        permissionedMint,
        permissionedBurn,
        grantRoleMinter,
        grantRoleBurner

    }
}