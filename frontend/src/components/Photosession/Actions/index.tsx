import React from 'react';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';
import {toast} from 'react-toastify';
import {Text, Button} from '@shared';
import {PhotoWebpUrl, PhotoOriginalUrl} from '@utils/photo';
import {Photo} from '@type/photo';
import './Actions.scss';

interface ActionsProps {
  photos: Photo[];
  folderName: string;
}

const Actions: React.FC<ActionsProps> = ({photos, folderName}) => {
  const handleSave = React.useCallback(
    async (type: string) => {
      if (photos.length < 1) {
        return;
      }

      const zip = new JSZip();

      await Promise.all(
        photos.map(async (photo) => {
          try {
            const response = await fetch(
              type === 'original'
                ? PhotoOriginalUrl(folderName, photo.name)
                : PhotoWebpUrl(folderName, photo.name)
            );
            if (!response.ok) {
              toast.error(`Ошибка загрузки фото: ${photo.name}`);
              return;
            }
            const blob = await response.blob();
            zip.file(photo.name, blob);
          } catch (error) {
            toast.error(`Ошибка загрузки фото: ${photo.name}`);
          }
        })
      );

      zip.generateAsync({type: 'blob'}).then((content) => {
        saveAs(content, `${folderName}.zip`);
      });
    },
    [photos]
  );

  return (
    <div className={'ActionsWrapper'}>
      <Button onClick={() => handleSave('original')}>
        <Text text={'Скачать оригиналы'} size={'large'} color={'white'} />
      </Button>
      <Button onClick={() => handleSave('webp')}>
        <Text text={'Скачать сжатый формат (для интернета)'} size={'large'} color={'white'} />
      </Button>
    </div>
  );
};

export default Actions;
