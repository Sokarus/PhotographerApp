import React from 'react';
import {Header} from '@components';
import {Text, InputText, Select} from '@shared';
import './Ticket.scss';

const Ticket: React.FC = () => {
  const [name, setName] = React.useState<string>('');
  const [socialLink, setSocialLink] = React.useState<string>('');
  const [shootingType, setShootingType] = React.useState<string>('');

  return (
    <>
      <Header color={'white'} />
      <div className={'TicketWrapper'}>
        <div className={'TicketContent'}>
          <div className={'TicketContentContainer'}>
            <Text text={'Имя:'} color={'white'} />
            <InputText
              text={name}
              setText={(event: React.ChangeEvent<HTMLInputElement>) =>
                setName(event.currentTarget.value)
              }
              placeholder={'Ваше имя'}
              color={'white'}
              type={'text'}
            />
          </div>
          <div className={'TicketContentContainer'}>
            <Text text={'Ссылка на соц. сеть:'} color={'white'} />
            <InputText
              text={socialLink}
              setText={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSocialLink(event.currentTarget.value)
              }
              placeholder={'Соц. сеть'}
              color={'white'}
              type={'text'}
            />
          </div>
          <div className={'TicketContentContainer'}>
            <Text text={'Вид съемки:'} color={'white'} />
            <Select
              options={['1', '2', '3']}
              setOption={(event) => setShootingType(event.target.value)}
              placeholder={'Выберите тип съемки'}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export {Ticket};
