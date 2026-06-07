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

declare interface ICreateOrderResponse {
  id: number;
  buyer: number;
  crop: number;
  quantity: number;
  total_price: string;
  delivery_address: string;
  status: string;
  payment_status: string;
}

declare interface IPaymentInitResponse {
  authorization_url: string;
  reference: string;
  amount: number;
  breakdown: {
    crop_price: number;
    delivery_fee: number;
    delivery_reason: string;
    platform_fee: number;
    farmer_payout: number;
    total: number;
  };
}