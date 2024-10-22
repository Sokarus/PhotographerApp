import React from 'react';
import {Header} from '@components';
import './Home.scss';

const Home: React.FC = () => {
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    const img = new Image();
    img.src = 'https://storage.yandexcloud.net/kocherovaphoto/main/main.webp';

    img.onload = async () => {
      setImageLoaded(true);
    };
  }, []);

  return (
    <>
      <Header />
      {!imageLoaded ? (
        <></>
      ) : (
        <div
          style={
            {
              '--background-image': imageLoaded
                ? "url('https://storage.yandexcloud.net/kocherovaphoto/main/main.webp')"
                : 'none',
            } as any
          }
          className={`HomeWrapper ${imageLoaded ? 'ImageLoaded' : ''}`}
        ></div>
      )}
    </>
  );
};

export {Home};
