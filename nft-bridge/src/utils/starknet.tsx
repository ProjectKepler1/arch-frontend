import { ChainInfo, isRejected, TransactionStatusStep } from '@starkware-industries/commons-js-enums';
import { getStarknet } from '../libs';
import { Contract } from 'starknet';
import { promiseHandler } from './index';


export const createL2Contract = (address: any, ABI: any) => {
    return new Contract(ABI, address, getStarknet().account);
};

export const callL2Contract = async (contract: any, method: any, ...args: any) => {
    const [response, error] = await promiseHandler(contract.call(method, args));
    if (error) {
        return Promise.reject(error);
    }
    return response;
};
