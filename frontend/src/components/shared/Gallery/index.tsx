import React from 'react';
import {RowsPhotoAlbum, Photo} from 'react-photo-album';
import {DownloadButton} from '@shared';

interface GalleryProps {
  photoFolder: string;
  photos: Photo[];
  onClick: (...props: any) => any;
  needActions: boolean;
}

const Gallery: React.FC<GalleryProps> = ({photoFolder, photos, onClick, needActions = false}) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = React.useState<boolean>(false);

  return (
    <>
      <RowsPhotoAlbum
        photos={photos}
        targetRowHeight={600}
        onClick={isDownloadModalOpen ? undefined : onClick}
        render={
          needActions
            ? {
                extras: (_, {index}) => {
                  return (
                    <DownloadButton
                      isModalOpen={isDownloadModalOpen}
                      setIsModalOpen={() => setIsDownloadModalOpen(!isDownloadModalOpen)}
                      photoFolder={photoFolder}
                      photoName={photos[index]?.title || ''}
                    />
                  );
                },
              }
            : undefined
        }
      />
      <div id={'download-photo-modal'} />
    </>
  );
};

export {Gallery};
