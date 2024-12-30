import React from 'react';
import JSZip from 'jszip';
import {saveAs} from 'file-saver';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {Text, Button} from '@shared';
import {PhotoWebpUrl, PhotoOriginalUrl} from '@utils/photo';
import {Photo} from '@type/photo';
import {Pending} from '@components';
import './Actions.scss';

interface ActionsProps {
  photos: Photo[];
  folderName: string;
}

const Actions: React.FC<ActionsProps> = ({photos, folderName}) => {
  const {t} = useTranslation();
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const handleSave = React.useCallback(
    async (type: string) => {
      if (photos.length < 1) {
        return;
      }

      setIsPending(true);
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
        setIsPending(false);
      });
    },
    [photos]
  );

  return (
    <>
      <div className={'ActionsWrapper'}>
        <Button onClick={() => handleSave('original')} style={'Border'}>
          <Text text={t('cкачать оригиналы')} size={'large'} color={'white'} />
        </Button>
        <Button onClick={() => handleSave('webp')} style={'Border'}>
          <Text text={t('cкачать сжатый формат (для интернета)')} size={'large'} color={'white'} />
        </Button>
      </div>
      {isPending && <Pending />}
    </>
  );
};

export default Actions;
