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

export {type Photosession};
