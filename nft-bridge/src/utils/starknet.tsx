import { ChainInfo, isRejected, TransactionStatusStep } from '@starkware-industries/commons-js-enums';
import { getStarknet } from '@starkware-industries/commons-js-libs/get-starknet';
import { Contract, stark, hash, number } from '@starkware-industries/commons-js-libs/starknet';

import { promiseHandler } from './index';


export const createL2Contract = (address: any, ABI: any) => {
    return new Contract(ABI, address, getStarknet().provider);
};

export const callL2Contract = async (contract: any, method: any, ...args: any) => {
    const [response, error] = await promiseHandler(contract.call(method, args));
    if (error) {
        return Promise.reject(error);
    }
    return response;
};
