import {
    AssetResponse,
    AxiosAssetResponse,
    AxiosCollectionResponse,
    CollectionResponse,
  } from "./types";
  import { axiosClient } from "./axiosCliemt"
  
  // Replace with your alchemy api key
  const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API;
  
  // https://docs.alchemy.com/alchemy/enhanced-apis/nft-api/getnfts
  const getNFTsForOwnerEndpoint = `https://eth-mainnet.g.alchemy.com/${ALCHEMY_API_KEY}/v1/getNFTs/`;
  // https://docs.alchemy.com/alchemy/enhanced-apis/nft-api/getnftmetadata
  const getNFTsForOwnerByCollectionEndpoint = `https://eth-mainnet.g.alchemy.com/${ALCHEMY_API_KEY}/v1/getNFTsByCollection/`;
  
  /*
   * Fetches paginated list of NFT's owned by the given address.
   *
   * You can use this function to display all of the user's NFTs
   * in a list view. For example you might have the user connect
   * their wallet via metamask and then direct them to a page where
   * they can see all their NFTs. All you have to do is put the
   * user's wallet address into this function and you will get back
   * an array of NFTs that you can render. Each NFT will have an
   * image uri that you can render along with the title of the NFT.
   */
  export async function getNFTsForOwner(
    ownerAddress: string,
    pageKey: string | null = null
  ): Promise<AssetResponse> {
    let getUrl = `${getNFTsForOwnerEndpoint}?owner=${ownerAddress}&withMetadata=true`;
    if (pageKey) {
      getUrl = `${getUrl}&pageKey=${pageKey}`;
    }
  
    const response: AxiosAssetResponse = await axiosClient.get(getUrl);
    return response.data;
  }
  
  /*
   * Fetches paginated list of NFT's owned by the given address only
   * for the given collection.
   *
   * This function is practically the same as getNFTsForOwner
   * but allows you to only fetch NFTs for the user that belong
   * to a particular collection. For instance if you have rendered
   * the NFTs from getNFTsForOwner and allowed the user to tap
   * into the collection, then you may want to only render NFTs
   * for that particular collection for the user.
   */
  export async function getNFTsForOwnerFilteredByCollection(
    ownerAddress: string,
    contractAddress: string,
    pageKey: string | null = null
  ): Promise<AssetResponse> {
    let getUrl = `${getNFTsForOwnerEndpoint}?owner=${ownerAddress}&contractAddresses%5B%5D=${contractAddress}&withMetadata=true`;
    if (pageKey) {
      getUrl = `${getUrl}&pageKey=${pageKey}`;
    }
  
    const response: AxiosAssetResponse = await axiosClient.get(getUrl);
    return response.data;
  }
  
  /*
   * Fetches NFT's owned by the given address and grouped by collection.
   *
   * This endpoint allows you to display the user's NFTs organized by
   * collection rather than as a flat list of images. The response will
   * be a list of collections and inside those collections will be a
   * list of NFTs that the user owns for that collection.
   */
  export async function getCollectionsForOwner(
    ownerAddress: string,
    maxNFTsPerContract: number = 10
  ): Promise<CollectionResponse> {
    const response: AxiosCollectionResponse = await axiosClient.get(
      `${getNFTsForOwnerByCollectionEndpoint}?owner=${ownerAddress}&maxNFTsPerContract=${maxNFTsPerContract}`
    );
    return response.data;
  }
  
