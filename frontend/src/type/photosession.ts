import {Photo} from './photo';

interface Photosession {
  id: number;
  title: string;
  folderName: string;
  position: number;
  public: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
  photos: Photo[];
}

interface PortfolioPhotosession {
  id: number;
  title: string;
  folderName: string;
  mainPhoto: string;
}

export {type Photosession, type PortfolioPhotosession};
