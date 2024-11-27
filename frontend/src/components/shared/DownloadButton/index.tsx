import React from 'react';
import {ImageButton} from '@shared';
import {IconUrl} from '@utils/photo';
import {DownloadModal} from '@shared';
import './DownloadButton.scss';

interface DownloadButtonProps {
  photoFolder: string;
  photoName: string;
  isModalOpen: boolean;
  setIsModalOpen: (...args: any) => any;
  isAbsolute?: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  photoFolder,
  photoName,
  isModalOpen,
  setIsModalOpen,
  isAbsolute = true,
}) => {
  const setIsModalOpenHandler = React.useCallback(
    (e: React.MouseEvent, close: boolean) => {
      e.stopPropagation();
      setIsModalOpen(close ? '' : photoName);
    },
    [photoFolder, photoName, setIsModalOpen]
  );

  return (
    <>
      <div className={isAbsolute ? 'DownloadButtonWrapper' : ''}>
        <ImageButton
          url={IconUrl('download')}
          alt={'download'}
          onClick={(e: React.MouseEvent) => setIsModalOpenHandler(e, false)}
        />
      </div>
      <DownloadModal
        isOpened={isModalOpen}
        onClose={(e: React.MouseEvent) => setIsModalOpenHandler(e, true)}
        photoFolder={photoFolder}
        photoName={photoName}
      />
    </>
  );
};

export {DownloadButton};
