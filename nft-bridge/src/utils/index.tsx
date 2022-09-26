import { getLogger, getLogLevel, setLogLevel } from './logger';

import { encode, number, uint256 } from 'starknet'
import { utils } from 'ethers'
import { ethers } from 'ethers';
import { web3 } from '../libs';

export * from './browser';
export * from './logger';
export * from './object';
export * from './parser';
export * from './string';
export * from './wallet';

export const promiseHandler = async (promise: any) => {
    try {
        return [await promise, null];
    } catch (err) {
        return [null, err];
    }
};

export const isValidAddress = (address: string): boolean => /^0x[0-9a-f]{1,64}$/.test(address)

export const formatAddress = (address: string) =>
    encode.addHexPrefix(encode.removeHexPrefix(address).padStart(64, '0'))

export const truncateAddress = (fullAddress: string) => {
    const address = formatAddress(fullAddress)

    const hex = address.slice(0, 9)
    const end = address.slice(-15)
    return `${hex}...${end}`
}
export const truncateAddress2 = (fullAddress?: string) => {
    const hex = fullAddress?.slice(0, 7)
    const end = fullAddress?.slice(-15)
    return `${hex}...${end}`
}

export function getUint256CalldataFromBN(bn: number.BigNumberish) {
    return { type: 'struct' as const, ...uint256.bnToUint256(bn) }
}

export function parseInputAmountToUint256(input: string, decimals = 18) {
    return getUint256CalldataFromBN(utils.parseUnits(input, decimals).toString())
}

export function parseInputAmountToUint256ExecuteCall(input: string, decimals = 18) {
    const _parsedAmount = uint256.bnToUint256(utils.parseUnits(input, decimals).toString())
    return [_parsedAmount.low, _parsedAmount.high]
}

export const getUID = () => '_' + (Math.random() * Math.random()).toString(36).substring(2, 9)



export const wait = (timeout = 1000) => {
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve(true)
        }, timeout)
    )
}

export const getHigherGWEI = async (library: any) => {
    const price = (await web3.eth.getGasPrice()) * 2;

    return price;
};

export const calculateGasMargin = (value: any) => {
    return value
        .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(1000)))
        .div(ethers.BigNumber.from(10000));
};


export const getDate = () => {
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
