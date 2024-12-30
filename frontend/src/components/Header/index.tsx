import React from 'react';
import RightSide from './RightSide';
import LeftSide from './LeftSide';
import Accordion from './Accordion';
import './Header.scss';

interface HeaderProps {
  color?: 'black' | 'white';
}

const Header: React.FC<HeaderProps> = ({color = 'black'}) => {
  const [scrolled, setScrolled] = React.useState<boolean>(false);
  const [windowWidth, setWindowWidth] = React.useState<number>(window.innerWidth);

  React.useEffect(() => {
    const scrollHandler = () => {
      setScrolled(window.scrollY > 50);
    };
    const widthHandler = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('resize', widthHandler);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', widthHandler);
    };
  }, []);

  return windowWidth >= 768 ? (
    <div className={`HeaderWrapper ${scrolled ? `Scrolled-${color}` : ''}`}>
      <LeftSide color={color} />
      <RightSide color={color} />
    </div>
  ) : (
    <Accordion />
  );
};

export {Header};
