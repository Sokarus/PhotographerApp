import React from 'react';
import {RowsPhotoAlbum, Photo} from 'react-photo-album';

interface GalleryProps {
  photos: Photo[];
  onClick: (...props: any) => any;
}

const Gallery: React.FC<GalleryProps> = ({photos, onClick}) => {
  return <RowsPhotoAlbum photos={photos} targetRowHeight={600} onClick={onClick} />;
};

export {Gallery};
