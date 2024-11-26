import React, {ReactElement} from 'react';
import {Text, ImageButton} from '@shared';
import {ColorTheme} from '@constant/style';
import {IconUrl} from '@utils/photo';
import './Modal.scss';

interface IModal {
  isOpened: boolean;
  title?: string;
  children: ReactElement[] | ReactElement;
  backgroundBlur?: number;
  fullWindow?: boolean;
  onClose: () => void;
  onPressEnter: () => any;
  style?: 'Black' | 'White';
}

const Modal: React.FC<IModal> = ({
  isOpened,
  title = '',
  children,
  backgroundBlur = 0.2,
  fullWindow = false,
  onClose,
  onPressEnter,
  style = 'Black',
}) => {
  React.useEffect(() => {
    if (!isOpened) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onPressEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpened, onPressEnter]);

  return isOpened ? (
    <div
      style={
        {
          '--background-blur': backgroundBlur,
          '--window-wrapper-top': fullWindow ? 0 : '30vh',
        } as any
      }
      className={'ModalWrapper'}
    >
      <div className={`ModalWindowWrapper${style} ${fullWindow ? 'ModalWindowFull' : ''}`}>
        <div className={'ModalWindowHeaderWrapper'}>
          {title && <Text text={title} color={ColorTheme.white} size={'large'} />}
          <ImageButton
            url={style === 'White' ? IconUrl('close_white') : IconUrl('close')}
            alt={'close'}
            onClick={onClose}
            style={style === 'White' ? 'Black' : 'Default'}
          />
        </div>
        {children}
      </div>
    </div>
  ) : (
    <></>
  );
};

export {Modal};
