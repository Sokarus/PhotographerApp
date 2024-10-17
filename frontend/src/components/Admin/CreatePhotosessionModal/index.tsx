import React from 'react';
import {Modal, InputText, Text, Button} from '@shared';
import {BaseModal} from '@type/modal';

interface ICreatePhotosessionModal extends BaseModal {}

const CreatePhotosessionModal: React.FC<ICreatePhotosessionModal> = ({isOpened, onClose}) => {
    console.log(isOpened);
  return (
    <Modal isOpened={isOpened} title={'Войти'} onClose={onClose}>
      <div className={'CreatePhotosessionModalWrapper'}>
        {'Test test '}
      </div>
    </Modal>
  );
};

export default CreatePhotosessionModal;
