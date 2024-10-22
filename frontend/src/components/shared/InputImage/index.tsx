import React, {ChangeEvent} from 'react';
import './InputImage.scss';

interface IInputImage {
  setImages: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputImage: React.FC<IInputImage> = ({setImages}) => {
  return (
    <label className={'InputImage'}>
      <input type={'file'} multiple className={'InputImageDefault'} onChange={setImages} />
      <span className={'InputImageCustom'}>Загрузить фото</span>
    </label>
  );
};

export {InputImage};
