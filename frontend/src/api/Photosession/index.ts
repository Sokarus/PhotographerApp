import { Photosession } from "@type/photosession";

const PhotosessionsData = async (): Promise<Photosession[]> => {
    return fetch('api/photosession/list', {
      method: 'GET',
    }).then(async (response) => {
      if (response.status === 200) {
        const photosessionsData: Photosession[] = await response.json();
  
        return photosessionsData;
      }
  
      throw new Error('Ошибка получения списка фотосессий.');
    });
  };

  export {PhotosessionsData};
