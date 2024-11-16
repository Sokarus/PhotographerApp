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
  onPressEnter: () => any;
}

const Modal: React.FC<IModal> = ({
  isOpened,
  title = '',
  children,
  backgroundBlur = 0.2,
  fullWindow = false,
  onClose,
  onPressEnter,
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
          '--window-wrapper-top': fullWindow ? 0 : '15vh',
        } as any
      }
      className={'ModalWrapper'}
    >
      <div className={`ModalWindowWrapper ${fullWindow ? 'ModalWindowFull' : ''}`}>
        <div className={'ModalWindowHeaderWrapper'}>
          {title && <Text text={title} color={ColorTheme.white} size={'large'} />}
          <ImageButton
            url={'https://storage.yandexcloud.net/kocherovaphoto/icons/close.svg'}
            alt={'close'}
            onClick={onClose}
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
