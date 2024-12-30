import {HeaderItem} from '@type/header';

const LeftSideItems: HeaderItem[] = [
  {
    text: 'главная',
    url: '/',
  },
  {
    text: 'портфолио',
    url: '/portfolio',
  },
  // {
  //   text: 'заявка',
  //   url: '/ticket',
  // },
  {
    text: 'администрирование',
    url: '/admin',
  },
];

const RightSideItems: HeaderItem[] = [
  {
    text: 'войти',
    url: '',
  },
  {
    text: 'регистрация',
    url: '',
  },
];

export {LeftSideItems, RightSideItems};
