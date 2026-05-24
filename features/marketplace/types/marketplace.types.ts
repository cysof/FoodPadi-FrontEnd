// features/marketplace/types/marketplace.types.ts
declare interface IMarketplaceInitialState {
  getAllProductsLoading: boolean;
  getAllProductsError: string;
  products: ICrop[];
  search: string;
  count: number;
  next: string | null;
  previous: string | null;
}