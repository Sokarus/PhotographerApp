import imageCompression from 'browser-image-compression';

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

export {ConvertPhotosToWebp};
