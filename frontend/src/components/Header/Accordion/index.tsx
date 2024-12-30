import React from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ImageButton, Modal, TextLink} from '@shared';
import {IconUrl} from '@utils/photo';
import {RootState} from '@state/index';
import {LeftSideItems} from '@constant/header';
import Language from '../Language';
import './Accordion.scss';

const Accordion: React.FC = () => {
  const {t} = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const {roles} = useSelector((state: RootState) => state.user);

  return (
    <div className={'AccordionWrapper'}>
      <Language />
      <ImageButton
        url={IconUrl('menu_white')}
        alt={'accordeon'}
        onClick={() => setIsMenuOpen(true)}
      />
      <Modal
        isOpened={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onPressEnter={() => {}}
        style={'Black'}
        fullWindow
      >
        <div className={'AccordionItems'}>
          {LeftSideItems?.map((item) => {
            if (item.url === '/admin' && !roles.includes('admin')) {
              return null;
            }

            return (
              <div className={'AccordionItem'}>
                <TextLink text={t(item.text)} url={item.url} textSize={'large'} color={'white'} />
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default Accordion;
