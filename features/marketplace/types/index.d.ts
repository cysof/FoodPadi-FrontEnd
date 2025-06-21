declare type searchTerm = {
  search?: string;
  ordering?: string;
  page?: number;
};

declare interface ICrop {
  id: number;
  farmer_name: string;
  crop_name: string;
  crop_description: string;
  quantity: number;
  unit: string;
  location: string;
  price_per_unit: number;
  harvested_date: string;
  is_Organic: boolean;
  availability: string;
  img: string;
  created_at: string;
  farmer: number;
}

declare interface IMarketplaceInitialState {
  getAllProductsLoading: boolean;
  getAllProductsError: string;
  products: ICrop[];
  search: string;
}

declare interface IGetMarketProduceResponse {
  count: number;
  next: string;
  previous: string;
  results: ICrop[];
}
