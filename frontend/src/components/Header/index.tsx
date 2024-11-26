import React from 'react';
import RightSide from './RightSide';
import LeftSide from './LeftSide';
import './Header.scss';

interface HeaderProps {
  color?: 'black' | 'white';
}

const Header: React.FC<HeaderProps> = ({color = 'black'}) => {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const scrollHandler = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', scrollHandler);

    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  return (
    <div className={`HeaderWrapper ${scrolled ? 'Scrolled' : ''}`}>
      <LeftSide color={color} />
      {localStorage.getItem('needAuth') ? <RightSide color={color} /> : <></>}
    </div>
  );
};

export {Header};
