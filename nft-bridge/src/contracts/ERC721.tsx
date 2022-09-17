import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "ethers"
import { getContractAddress } from "ethers/lib/utils"
import { feeTransactionVersion } from "starknet/dist/utils/hash"
import { hexToDecimalString, toBN, toFelt } from "starknet/dist/utils/number"
import { ERC721_STARKNET_ABI, ERC721_TOKEN_MOCK_ABI } from "../abi/erc721"
import { L1BridgeContractAddress } from "../config/envs"
import { useBridgeContractL1, useBridgeContractL2 } from "../hooks/useContract"
import { getStarknet, starknet } from "../libs"
import { getHigherGWEI } from "../utils"
import { createL2Contract } from "../utils/starknet"
import { Account } from "starknet"
import { accountInfo } from "../providers/WalletsProvider"
import { useTransactionL1 } from "../providers/EthTransactionProvider"


export const useERC721ContractL1 = (L1_CollectionAddress: string) => {
    const { getContractL1 } = useBridgeContractL1()
    const { addTransactionL1 } = useTransactionL1()
    const getERC721Contract = async () =>
        await getContractL1(L1_CollectionAddress, ERC721_TOKEN_MOCK_ABI);
    const getDate = () => {
        const c_date = new Date()
        const date = c_date.toLocaleDateString(undefined, { // you can use undefined as first argument
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        })
        return (date)
    }
    const setApprovalForAll = async (from: string) => {
        const contract = await getERC721Contract();
        return await contract.methods.setApprovalForAll(L1BridgeContractAddress, true).send({ from: from })
            .then(function (receipt: any) {
                addTransactionL1(receipt, "SET_APPROVAL_FOR_ALL", getDate(), () => { }, () => { })
            });

    }


    return {
        setApprovalForAll
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
    const grantRoleMinter = async (account: string) => {

        const contract = await getERC721Contract()
        const { res } = await contract.call("getMinterRole");
        return await contract.invoke("grantRole", [res, account])

    }
    const grantRoleBurner = async (account: string) => {
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