import imageCompression from 'browser-image-compression';
import {Url} from '@constant/yandex';

const ConvertPhotosToWebp = async (files: File[]) =>
  Promise.all(
    Array.from(files).map(async (file) => {
      const options = {
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: 'image/webp',
      };

      try {
        const lastDotIndex = file.name.lastIndexOf('.');
        const compressedPhoto = await imageCompression(file, options);
        const newPhotoName = `${file.name.substring(0, lastDotIndex)}_compressed.webp`;
        const newPhoto = new File([compressedPhoto], newPhotoName, {
          type: 'image/webp',
          lastModified: Date.now(),
        });

        return newPhoto;
      } catch (error) {
        console.error('Ошибка при конвертации изображения:', error);
        return null;
      }
    })
  );

const PhotoWebpUrl = (photoFolder: string, photoName: string) =>
  `${Url}photosession/${photoFolder}/${photoName.split('.')[0]}_compressed.webp`;

const PhotoOriginalUrl = (photoFolder: string, photoName: string) =>
  `${Url}photosession/${photoFolder}/${photoName}`;

const IconUrl = (iconName: string) => `${Url}icons/${iconName}.svg`;

const GetPhotoExtention = (photoName: string): string => {
  const parts = photoName.split('.');

  return parts.length > 1 ? parts.pop()! : '';
};

export {ConvertPhotosToWebp, PhotoWebpUrl, PhotoOriginalUrl, IconUrl, GetPhotoExtention};
