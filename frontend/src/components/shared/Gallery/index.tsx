import React from 'react';
import {RowsPhotoAlbum, Photo} from 'react-photo-album';
import {DownloadButton} from '@shared';
import {PhotoOriginalUrl, PhotoWebpUrl} from '@utils/photo';

interface GalleryProps {
  photoFolder: string;
  photos: Photo[];
  onClick: (...props: any) => any;
  needActions: boolean;
}

const Gallery: React.FC<GalleryProps> = ({photoFolder, photos, onClick, needActions = false}) => {
  const [downloadPhotoName, setDownloadPhotoName] = React.useState<string>('');

  const downloadPhotoHandler = React.useCallback((photoName: string) => {
    setDownloadPhotoName(photoName);
  }, []);

  return (
    <>
      <RowsPhotoAlbum
        photos={photos}
        targetRowHeight={600}
        onClick={downloadPhotoName ? undefined : onClick}
        render={
          needActions
            ? {
                extras: (_, {index}) => {
                  return (
                    <DownloadButton
                      key={photos[index]?.title || ''}
                      isModalOpen={downloadPhotoName === photos[index]?.title}
                      setIsModalOpen={downloadPhotoHandler}
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
