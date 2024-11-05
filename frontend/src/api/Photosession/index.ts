import {Transliterate} from '@utils/string';
import {ConvertPhotosToWebp} from '@utils/photo';
import {Photosession, PortfolioPhotosession} from '@type/photosession';

const PhotosessionsList = async (): Promise<Photosession[]> => {
  return fetch('api/photosession/list', {
    method: 'GET',
  }).then(async (response) => {
    if (response.status === 200) {
      const data: {data: Photosession[]} = await response.json();

      return data.data;
    }

    throw new Error('Ошибка получения списка фотосессий.');
  });
};

const Portfolio = async (): Promise<PortfolioPhotosession[]> => {
  return fetch('oapi/photosession/portfolio', {
    method: 'GET',
  }).then(async (response) => {
    if (response.status === 200) {
      const data: {data: PortfolioPhotosession[]} = await response.json();

      return data.data;
    }

    throw new Error('Ошибка получения портфолио.');
  });
};

const Create = async (title: string, photos: File[]): Promise<boolean> => {
  const formData = new FormData();
  const convertedPhotos = await ConvertPhotosToWebp(photos);

  photos.forEach((photo) => {
    formData.append('photos', photo);
  });
  convertedPhotos.forEach((convertedPhoto) => {
    formData.append('photosConverted', convertedPhoto as File);
  });
  formData.append('title', title);
  formData.append('path', Transliterate(title));

  return fetch('api/photosession/create', {
    method: 'POST',
    body: formData,
  }).then(async (response) => {
    if (response.status === 201) {
      return true;
    }

    const errorData = await response.json();

    throw new Error(errorData.message);
  });
};

const Save = async (photosession: Photosession) => {
  return fetch('api/photosession/update', {
    method: 'POST',
    body: JSON.stringify(photosession),
  }).then(async (response) => {
    if (response.status === 200) {
      return true;
    }

    const errorData = await response.json();

    throw new Error(errorData.message);
  });
};

const Get = async (name: string) => {
  return fetch(`oapi/photosession?name=${name}`, {
    method: 'GET',
  }).then(async (response) => {
    if (response.status === 200) {
      const data: {data: Photosession} = await response.json();

      return data.data;
    }

    throw new Error('Ошибка получения фотосессии.');
  });
};

export {PhotosessionsList, Create, Save, Portfolio, Get};
