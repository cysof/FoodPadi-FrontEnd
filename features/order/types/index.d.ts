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

declare enum Status {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

declare interface getAllOrdersInitialState {
  getAllOrdersLoading: boolean;
  getAllOrdersError: string;
  orders: IOrderData[];
  search: string;
}
