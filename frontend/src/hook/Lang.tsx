import React from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {setLang} from '@state/User';
import {RootState} from '@state/index';

const useLang = () => {
  const dispatch = useDispatch();
  const {lang} = useSelector((state: RootState) => state.user);
  const {i18n} = useTranslation();

  React.useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang)
  }, [lang, i18n]);

  const toggleLanguage = () => {
    const newLang = lang === 'ru' ? 'en' : 'ru';
    dispatch(setLang(newLang));
  };

  return {lang, toggleLanguage};
};

export default useLang;
