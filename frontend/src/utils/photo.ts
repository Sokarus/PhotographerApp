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
        const compressedPhoto = await imageCompression(file, options);
        const newPhotoName = `${file.name.split('.')[0]}_compressed.webp`;
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

export {ConvertPhotosToWebp, PhotoWebpUrl, PhotoOriginalUrl, IconUrl};
