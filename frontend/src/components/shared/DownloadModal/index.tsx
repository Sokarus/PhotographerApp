import React from 'react';
import ReactDOM from 'react-dom';
import {useTranslation} from 'react-i18next';
import {Modal, Button, Text} from '@shared';
import {PhotoOriginalUrl, PhotoWebpUrl} from '@utils/photo';
import {BaseModal} from '@type/modal';
import './DownloadModal.scss';

interface DownloadModalProps extends BaseModal {
  photoFolder: string;
  photoName: string;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpened,
  onClose,
  photoFolder,
  photoName,
}) => {
    const {t} = useTranslation();
  const downloadPhotoContainer = document.getElementById('download-photo-modal');
  const downloadHandler = React.useCallback(
    (e: React.MouseEvent, type: string) => {
      e.stopPropagation();
      e.preventDefault();

      if (!photoName) {
        return;
      }

      const href =
        type === 'original'
          ? PhotoOriginalUrl(photoFolder, photoName)
          : PhotoWebpUrl(photoFolder, photoName);

      const link = document.createElement('a');
      link.download = photoName;
      link.href = href;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [photoFolder, photoName]
  );

  if (!downloadPhotoContainer || !isOpened) {
    return null;
  }

  return ReactDOM.createPortal(
    <Modal
      isOpened={isOpened}
      onClose={onClose}
      onPressEnter={() => {}}
      style={'White'}
      backgroundBlur={0.9}
    >
      <div className={'DownloadModalWrapper'}>
        <Button onClick={(e: React.MouseEvent) => downloadHandler(e, 'original')} style={'Border'}>
          <Text text={t('cкачать оригинал')} color={'white'} />
        </Button>
        <Button onClick={(e: React.MouseEvent) => downloadHandler(e, 'web')} style={'Border'}>
          <Text text={t('cкачать сжатый формат (для интернета)')} color={'white'} />
        </Button>
      </div>
    </Modal>,
    downloadPhotoContainer
  );
};

export {DownloadModal};
