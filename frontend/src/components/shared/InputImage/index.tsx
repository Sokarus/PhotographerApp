import React, {ChangeEvent} from 'react';

interface IInputImage {
  setImages: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputImage: React.FC<IInputImage> = ({setImages}) => {
  return <input type={'file'} multiple className={'InputImageWrapper'} onChange={setImages} />;
};

export {InputImage};
