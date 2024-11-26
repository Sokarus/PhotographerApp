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
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  photoFolder,
  photoName,
  isModalOpen,
  setIsModalOpen,
}) => {
  const setIsModalOpenHandler = React.useCallback(
    (e: React.MouseEvent, isOpen: boolean) => {
      e.stopPropagation();
      setIsModalOpen(isOpen);
    },
    [photoFolder, photoName, setIsModalOpen]
  );

  return (
    <>
      <div className={'DownloadButtonWrapper'}>
        <ImageButton
          url={IconUrl('download')}
          alt={'download'}
          onClick={(e: React.MouseEvent) => setIsModalOpenHandler(e, true)}
        />
      </div>
      <DownloadModal
        isOpened={isModalOpen}
        onClose={(e: React.MouseEvent) => setIsModalOpenHandler(e, false)}
        photoFolder={photoFolder}
        photoName={photoName}
      />
    </>
  );
};

export {DownloadButton};
