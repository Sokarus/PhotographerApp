import React from 'react';
import {ImageButton} from '@shared';
import {IconUrl, PhotoOriginalUrl} from '@utils/photo';
import {Photo} from '@type/photo';
import {DownloadButton} from '@shared';
import './PhotoView.scss';

interface PhotoViewProps {
  photo: Photo;
  onClose: (...args: any) => any;
  onLeftClick: (...args: any) => any;
  onRightClick: (...args: any) => any;
  folderName: string;
  needActions: boolean;
}

const PhotoView: React.FC<PhotoViewProps> = ({
  photo,
  onClose,
  onLeftClick,
  onRightClick,
  folderName,
  needActions = false,
}) => {
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = React.useState<boolean>(false);
  const [orientation, setOrientation] = React.useState<'Vertical' | 'Horizontal'>('Vertical');
  const [touchStart, setTouchStart] = React.useState<{x: number; y: number} | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<{x: number; y: number} | null>(null);
  const sliderRef = React.useRef<HTMLDivElement | null>(null);
  const startXRef = React.useRef<number | null>(null);
  const currentTranslate = React.useRef<number>(0);
  const isDraggingRef = React.useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({x: touch.clientX, y: touch.clientY});
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const touch = e.touches[0];
    setTouchEnd({x: touch.clientX, y: touch.clientY});
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 50) {
        onLeftClick();
      } else if (dx < -50) {
        onRightClick();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    currentTranslate.current = 0;
    sliderRef.current?.classList.add('grabbing');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || startXRef.current === null) return;

    const deltaX = e.clientX - startXRef.current;
    currentTranslate.current = deltaX;

    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${deltaX}px)`;
    }
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;

    const deltaX = currentTranslate.current;

    if (Math.abs(deltaX) > 100) {
      if (deltaX > 0) {
        onLeftClick();
      } else if (deltaX < 0) {
        onRightClick();
      }
    }

    resetSliderPosition();
  };

  const resetSliderPosition = () => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = 'translateX(0)';
    }
    currentTranslate.current = 0;
    isDraggingRef.current = false;
    sliderRef.current?.classList.remove('grabbing');
  };

  React.useEffect(() => {
    if (!photo) {
      return;
    }

    setImageLoaded(false);

    const img = new Image();
    img.src = PhotoOriginalUrl(folderName, photo.name);

    const updateOrientation = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const photoAspectRatio = img.width / img.height;
      const screenAspectRatio = screenWidth / screenHeight;

      if (photoAspectRatio > screenAspectRatio) {
        setOrientation('Horizontal');
      } else {
        setOrientation('Vertical');
      }
    };

    img.onload = async () => {
      setImageLoaded(true);
      updateOrientation();
      window.addEventListener('resize', updateOrientation);
    };

    return () => window.removeEventListener('resize', updateOrientation);
  }, [photo, folderName, needActions]);

  return (
    <div className={'PhotoView'}>
      <div className={'PhotoViewLeft'} onClick={onLeftClick}>
        <div className={'PhotoViewLeftLight'} />
      </div>
      <div className={'PhotoViewRight'} onClick={onRightClick}>
        <div className={'PhotoViewRightLight'} />
      </div>
      {imageLoaded ? (
        <div className={'PhotoViewBox'}>
          <div
            className={'PhotoViewBoxRelative'}
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetSliderPosition}
            draggable={false}
          >
            <img
              className={`PhotoViewBoxImage${orientation}`}
              src={PhotoOriginalUrl(folderName, photo.name)}
              draggable={false}
            />
            <div className={'PhotoViewBoxRelativeActions'}>
              <ImageButton url={IconUrl('close')} alt={'close'} onClick={onClose} />
              {needActions ? (
                <DownloadButton
                  isModalOpen={isDownloadModalOpen}
                  setIsModalOpen={() => setIsDownloadModalOpen(!isDownloadModalOpen)}
                  photoFolder={folderName}
                  photoName={photo.name}
                  isAbsolute={false}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={'PhotoViewPending'}>
          <img
            className={'PhotoViewPendingImage'}
            width={50}
            height={50}
            src={IconUrl('pending_white')}
          />
        </div>
      )}
    </div>
  );
};

export {PhotoView};
