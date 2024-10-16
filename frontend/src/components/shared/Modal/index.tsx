import React, {ReactElement} from 'react';
import {Text, ImageButton} from '@shared';
import './Modal.scss';

interface IModal {
  isOpened: boolean;
  title: string;
  children: ReactElement[] | ReactElement;
  onClose: () => void;
}

const Modal: React.FC<IModal> = ({isOpened, title, children, onClose}) => {
  return isOpened ? (
    <div className={'ModalWrapper'}>
      <div className={'ModalWindowWrapper'}>
        <div className={'ModalWindowHeaderWrapper'}>
          <Text text={title} />
          <ImageButton url={'static/icons/close.svg'} alt={'close'} onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  ) : (
    <></>
  );
};

export {Modal};
