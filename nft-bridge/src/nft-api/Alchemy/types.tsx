interface Contract {
    address: string;
  }
  
  interface Id {
    tokenId: string;
  }
  
  interface Media {
    uri: string;
  }
  
  interface Metadata {
    image: string;
  }
  
  interface Asset {
    contract: Contract;
    id: Id;
    title: string;
    description: string;
    externalDomainViewUrl: string;
    media: Media;
    alternateMedia: Media[];
    metadata: Metadata;
    timeLastUpdated: string;
  }
  
  export interface AssetResponse {
    ownedNfts: Asset[];
    totalCount: number;
    pageKey?: string;
  }
  
  export interface AxiosAssetResponse {
    data: AssetResponse;
  }
  
  interface Collection {
    contract: Contract;
    verified: boolean; // true if the contract is verified on OpenSea, false otherwise
    name: string;
    assets: Asset[];
  }
  
  export interface CollectionResponse {
    collections: Collection[];
  }
  
  export interface AxiosCollectionResponse {
    data: CollectionResponse;
  }