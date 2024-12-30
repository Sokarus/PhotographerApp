import React, {ChangeEvent} from 'react';
import './InputImage.scss';

interface IInputImage {
  setImages: (event: ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
}

const InputImage: React.FC<IInputImage> = ({setImages, multiple = true}) => {
  return (
    <label className={'InputImage'}>
      <input
        type={'file'}
        multiple={multiple}
        className={'InputImageDefault'}
        onChange={setImages}
      />
      <span className={'InputImageCustom'}>Загрузить фото</span>
    </label>
  );
};

export {InputImage};
