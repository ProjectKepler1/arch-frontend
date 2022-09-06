import { useWeb3React } from "@web3-react/core"
import { ERC721_TOKEN_MOCK_ABI } from "../abi/erc721"
import { L1BridgeContractAddress } from "../config/envs"
import { useBridgeContract } from "../hooks/useContract"
import { getHigherGWEI } from "../utils"


export const useERC721Contract = (L1_CollectionAddress: string) => {
    const { getContract } = useBridgeContract()
    const L1BridgeAddress: string = L1BridgeContractAddress ?? ""
    const getERC721Contract = async () =>
        await getContract(L1_CollectionAddress, ERC721_TOKEN_MOCK_ABI);

    const setApprovalForAll = async (from: string) => {
        const contract = await getERC721Contract();
        return await contract.methods.setApprovalForAll(L1BridgeAddress, true).send({ from: from });
    };


    return {
        setApprovalForAll
    }
}