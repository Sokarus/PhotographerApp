import React from 'react';
import ReactDOM from 'react-dom';
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
  const downloadPhotoContainer = document.getElementById('download-photo-modal');
  const downloadHandler = React.useCallback(
    (e: React.MouseEvent, type: string) => {
      e.stopPropagation();

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
    <Modal isOpened={isOpened} onClose={onClose} onPressEnter={() => {}} style={'White'}>
      <div className={'DownloadModalWrapper'}>
        <Button onClick={(e: React.MouseEvent) => downloadHandler(e, 'original')} style={'Black'}>
          <Text text={'Скачать оригинал'} color={'white'} />
        </Button>
        <Button onClick={(e: React.MouseEvent) => downloadHandler(e, 'original')} style={'Black'}>
          <Text text={'Скачать веб-формат'} color={'white'} />
        </Button>
      </div>
    </Modal>,
    downloadPhotoContainer
  );
};

export {DownloadModal};
