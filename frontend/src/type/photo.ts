interface Photo {
  id: number;
  name: string;
  position: number;
  public: boolean;
  photosessionId: number;
  createdAt: string;
  updatedAt: string;
}

interface PhotoObject {
  file: File;
  url: string;
}

export {type Photo, type PhotoObject};
