// features/orderById/types/orderById.types.ts

declare interface IGetOrderInput {
  id: number;
}

declare interface ICancelOrderInput {
  id: number;
  reason: string;
}

declare interface IOrderActionResponse {
  detail: string;
}

declare interface IOrderByIdInitialState {
  getOneOrderLoading: boolean;
  getOneOrderError: string;
  acceptOrderLoading: boolean;
  acceptOrderError: string;
  cancelOrderLoading: boolean;
  cancelOrderError: string;
  order: IOrderData | null;
}

declare interface IOrderData {
  id: string;
  buyer_name: string;
  crop_name: string;
  quantity: number;
  price_per_unit: string;
  total_price: string;
  status: Status;
  ordered_at: string;
  delivery_address: string;
  notes: string;
  buyer: number;
  crop: number;
  cancel_reason: string | null;  // Add this
}