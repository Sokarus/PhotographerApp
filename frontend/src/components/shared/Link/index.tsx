import React, {ReactElement} from 'react';
import './Link.scss';

interface ILink {
  href: string;
  children: ReactElement[] | ReactElement;
  onClick?: () => void;
}

const Link: React.FC<ILink> = ({href, children, onClick}) => {
  const ClickHandler = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
        event.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  return (
    <a className={'LinkWrapper'} href={href} onClick={ClickHandler}>
      {children}
    </a>
  );
};

export {Link};
