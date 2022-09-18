
import { supportedL1ChainId } from "../config/envs"

export const GoerliVoyagerLink = 'https://goerli.voyager.online'
export const VoyagerLink = "https://voyager.online/"
export const GoerliEtherscan = "https://goerli.etherscan.io/"
export const Etherscan = "https://etherscan.io/"

export const openInNewTab = (url: any) => {
	(window as any).open(url, "_blank")!.focus();
};

export const getUrlParameter = (name: any) => {
	const results = new RegExp(`[?&]${name}=([^&#]*)`).exec(
		(window as any).location.href
	);
	if (results === null) {
		return null;
	}
	return decodeURI(results[1]) || 0;
};

export const isChrome = () => {
	if (typeof navigator !== "undefined")
		return /(?=.*(chrome)).*/i.test(navigator.userAgent);
};


export const getVoyagerLink = (txHash?: string): string => {
	if (supportedL1ChainId === 5)
		return `${GoerliVoyagerLink}/tx/${txHash}`
	else
		return `${VoyagerLink}/tx/${txHash}`
}
export const getEtherscanLink = (txHash?: string): string => {
	if (supportedL1ChainId === 5)
		return `${GoerliEtherscan}/tx/${txHash}`
	else
		return `${Etherscan}/tx/${txHash}`
}