declare type GetACropInput = {
  id: number;
};

declare interface IMarketCropIDInitialState {
  getOneProductLoading: boolean;
  getOneProductError: string;
  createOrderLoading: boolean;
  createOrderError: string;
  product: ICrop | null;
  loaded: boolean;
}

declare interface IOrder {
  quantity: number;
  delivery_address: string;
  notes: string;
  crop: number;
}
