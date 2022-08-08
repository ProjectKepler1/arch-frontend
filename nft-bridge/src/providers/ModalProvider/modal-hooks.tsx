import { useCallback, useContext } from 'react';

import { ModalType } from '../../enums/ModalType';
import { ModalContext } from './modal-context';

export const useModal = () => {
  return {
    ...useContext(ModalContext)
  };
};

