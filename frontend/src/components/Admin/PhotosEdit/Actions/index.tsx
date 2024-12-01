import React from 'react';
import {ImageButton} from '@shared';
import {IconUrl} from '@utils/photo';
import {Photo} from '@type/photo';
import './Actions.scss';

interface ActionsProps {
  photo: Photo;
  index: number;
  needHead: boolean;
  publishHandler: (...args: any) => any;
  mainHandler: (...args: any) => any;
  headHandler: (...args: any) => any;
}

const Actions: React.FC<ActionsProps> = ({
  photo,
  index,
  needHead,
  publishHandler,
  mainHandler,
  headHandler,
}) => {
  const [isActionsOpen, setIsActionsOpen] = React.useState<boolean>(false);

  const publishImage = (isPublished: boolean) =>
    isPublished ? IconUrl('published') : IconUrl('unpublished');
  const mainImage = (isMain: boolean) => (isMain ? IconUrl('main') : IconUrl('not_main'));
  const headImage = (isHead: boolean) => (isHead ? IconUrl('head') : IconUrl('not_head'));
  const deleteHandler = React.useCallback(() => {
    console.log(photo);
  }, [photo, index, needHead]);

  return (
    <div className={'PhotosEditActionsWrapper'}>
      {isActionsOpen ? (
        <>
          <ImageButton
            url={IconUrl('close')}
            alt={'close'}
            onClick={() => setIsActionsOpen(false)}
          />
          <ImageButton
            url={publishImage(photo.public)}
            alt={'published'}
            onClick={() => publishHandler(index, !photo.public)}
          />
          <ImageButton
            url={mainImage(photo.main)}
            alt={'main'}
            onClick={() => mainHandler(index, !photo.main)}
          />
          {needHead ? (
            <ImageButton
              url={headImage(photo.head)}
              alt={'head'}
              onClick={() => headHandler(index, !photo.head)}
            />
          ) : (
            <></>
          )}
          <ImageButton url={IconUrl('delete')} alt={'delete'} onClick={() => deleteHandler()} />
        </>
      ) : (
        <ImageButton
          url={IconUrl('menu_white')}
          alt={'accordeon'}
          onClick={() => setIsActionsOpen(true)}
        />
      )}
    </div>
  );
};

export default Actions;
