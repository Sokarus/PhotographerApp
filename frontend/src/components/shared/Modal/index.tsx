import React, {ReactElement} from 'react';
import {Text, ImageButton} from '@shared';
import {ColorTheme} from '@constant/style';
import './Modal.scss';

interface IModal {
  isOpened: boolean;
  title?: string;
  children: ReactElement[] | ReactElement;
  backgroundBlur?: number;
  fullWindow?: boolean;
  onClose: () => void;
}

const Modal: React.FC<IModal> = ({
  isOpened,
  title = '',
  children,
  backgroundBlur = 0.2,
  fullWindow = false,
  onClose,
}) => {
  return isOpened ? (
    <div
      style={
        {
          '--background-blur': backgroundBlur,
          '--window-wrapper-top': fullWindow ? 0 : '15vh',
        } as any
      }
      className={'ModalWrapper'}
    >
      <div className={`ModalWindowWrapper ${fullWindow ? 'ModalWindowFull' : ''}`}>
        <div className={'ModalWindowHeaderWrapper'}>
          {title && <Text text={title} color={ColorTheme.white} size={'large'} />}
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
