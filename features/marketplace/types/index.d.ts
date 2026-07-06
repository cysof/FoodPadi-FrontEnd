// features/marketplace/types/index.d.ts

declare type searchTerm = {
  search?: string;
  ordering?: string;
  page?: number;
  category?: number;
  availability?: string;
};

declare interface ICropImage {
  id: number;
  image_url: string;
  order: number;
}

declare interface ICategory {
  id: number;
  name: string;
  slug: string;
  display_order: number;
}

declare interface IUnit {
  id: number;
  name: string;
  is_other: boolean;
}

declare interface ICrop {
  id: number;
  farmer_name: string;
  crop_name: string;
  crop_description: string;
  category: ICategory | null;
  quantity: number;
  unit: IUnit;
  custom_unit_note?: string;
  location: string;
  price_per_unit: number;
  harvested_date: string;
  is_Organic: boolean;
  availability: string;
  img: string;
  image_url: string;
  additional_images: ICropImage[];
  created_at: string;
  farmer: number;
}

declare interface IMarketplaceInitialState {
  getAllProductsLoading: boolean;
  getAllProductsError: string;
  products: ICrop[];
  search: string;
  selectedCategory: number | null;
  inStockOnly: boolean;
  count: number;
  next: string | null;
  previous: string | null;
}

declare interface IGetMarketProduceResponse {
  count: number;
  next: string;
  previous: string;
  results: ICrop[];
}

declare interface IGetCategoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ICategory[];
}

declare interface IGetUnitsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IUnit[];
}
