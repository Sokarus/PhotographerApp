import React from 'react';
import {Button, Text} from '@shared';
import useLang from '@hook/Lang';
import './Language.scss';

const Language: React.FC = () => {
  const {lang, toggleLanguage} = useLang();

  return (
    <div className={'LanguageWrappaer'}>
      <Button onClick={toggleLanguage}>
        <Text text={lang.toUpperCase()} />
      </Button>
    </div>
  );
};

export default Language;
