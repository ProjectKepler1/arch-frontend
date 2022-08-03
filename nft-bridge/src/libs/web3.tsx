
import Web3 from 'web3';

declare global {
    interface Window {
        ethereum: any,
        web3: any
    }
}
let web3: any;
if (typeof window !== 'undefined') {
    if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
        web3 = new Web3(window.ethereum || window.web3.currentProvider);
    } else {
        web3 = new Web3();
    }
}
else {
    const provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/92c46476512549d3a34dbff7360c37de");
    web3 = new Web3(provider);
}
export { web3 };