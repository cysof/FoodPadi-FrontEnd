// features/order/types/index.d.ts

declare interface IDeliveryInfo {
  id: number;
  delivery_status: string;
  delivery_address: string;
  delivery_date: string;
  accepted_at: string | null;
  on_the_way_at: string | null;
  delivered_at: string | null;
  cancel_reason: string | null;
  proof_of_delivery_image: string | null;
  transporter_name: string;
  transporter_phone: string;
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
  cancel_reason: string | null;
  delivery: IDeliveryInfo | null;
}

declare interface IOrderResponse {
  count: number;
  next: string;
  previous: string;
  results: IOrderData[];
}

declare interface IOrderInput {
  search?: string;
  ordering?: string;
  page?: number;
}

declare interface getAllOrdersInitialState {
  getAllOrdersLoading: boolean;
  getAllOrdersError: string;
  orders: IOrderData[];
  search: string;
}