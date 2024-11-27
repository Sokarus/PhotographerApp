import {HeaderItem} from '@type/header';

const LeftSideItems: HeaderItem[] = [
  {
    text: 'Главная',
    url: '/',
  },
  {
    text: 'Портфолио',
    url: '/portfolio',
  },
  {
    text: 'Администрирование',
    url: '/admin',
  },
];

const RightSideItems: HeaderItem[] = [
  {
    text: 'Войти',
    url: '',
  },
  {
    text: 'Регистрация',
    url: '',
  },
];

export {LeftSideItems, RightSideItems};
