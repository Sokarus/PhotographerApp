import React from 'react';

interface IText {
  text: string;
}

const Text: React.FC<IText> = ({text}) => {
  return <span>{text}</span>;
};

export {Text};
