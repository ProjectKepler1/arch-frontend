import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { UseWalletProvider as UseWalletProviderWrapper } from 'use-wallet';

import { useEnvs } from '../hooks/useEnvs';
import { NftContext } from './NftProvider/NftProvider';

export const WalletProvider = ({ children }: { children: any }) => {
    const { pollBlockNumberInterval, supportedL1ChainId } = useEnvs();
    return (
        <UseWalletProviderWrapper
            autoConnect={false}
            connectors={{
                injected: {
                    chainId: [supportedL1ChainId]
                }
            }}
            pollBlockNumberInterval={pollBlockNumberInterval}
        >
            {children}
        </UseWalletProviderWrapper>
    );
};

WalletProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};
