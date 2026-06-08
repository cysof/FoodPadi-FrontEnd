// features/crops/types/index.d.ts

declare interface ICropForm {
  crop_description: string;
  crop_name: string;
  harvested_date: string;
  img: File;  // remove null
  location: string;
  price_per_unit: number;
  quantity: number;
  unit: string;
  availability: string;
}

declare interface ICropFormUpdate {
  id: number;
  form: FormData;
}

declare interface ICropSubmission {
  crop_name: string;
  crop_description: string;
  quantity: number;
  img: File;
  unit: string;
  location: string;
  price_per_unit: number;
  harvested_date: string;
}

declare interface ICropInputID {
  id: number;
}

declare interface ICropInitialState {
  getAllCropsLoading: boolean;
  getAllCropsError: string;
  crops: ICrop[];
  showCreateCropModal: boolean;
  showUpdateCropModal: boolean;
  selectedCrop: ICrop;
  createCropsLoading: boolean;
  createCropsError: string;
  deleteCropsError: string;
  deleteCropsLoading: boolean;
  updateCropsLoading: boolean;
  updateCropsError: string;
  search: string;
  count: number;
  next: string | null;
  previous: string | null;
}

declare interface IChangeAvailability {
  id: number;
  availability: string;
}

declare interface ICropInput {
  id: number;
  farmer_name: string;
  crop_name: string;
  crop_description: string;
  quantity: number;
  unit: string;
  location: string;
  price_per_unit: number;
  harvested_date: string | null;
  is_Organic: boolean;
  availability: string;
  img: string | File | null | undefined;
  created_at: string;
  farmer: number;
  additional_images?: ICropImage[];
}