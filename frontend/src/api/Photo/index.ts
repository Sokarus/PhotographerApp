import {ConvertPhotosToWebp} from '@utils/photo';

const Upload = async (photosessionName: string, photos: File[]): Promise<boolean> => {
  let countSlice = 0;

  while (countSlice < photos.length) {
    const formData = new FormData();
    const slicedPhotos = photos.slice(countSlice, countSlice + 10);
    const convertedPhotos = await ConvertPhotosToWebp(slicedPhotos);
    console.log(slicedPhotos);
    slicedPhotos.forEach((photo) => {
      formData.append('photos', photo);
    });
    convertedPhotos.forEach((convertedPhoto) => {
      formData.append('photosConverted', convertedPhoto as File);
    });
    formData.append('photosessionName', photosessionName);

    await fetch('/api/photo/upload', {
      method: 'POST',
      body: formData,
    });

    countSlice += 10;
  }

  return true;
};

const Delete = async (id: number) => {
  return fetch(`/api/photo/delete?id=${id}`, {
    method: 'DELETE',
  }).then(async (response) => {
    if (response.status === 200) {
      return true;
    }

    const errorData = await response.json();

    throw new Error(errorData.message);
  });
};

export {Upload, Delete};
