declare interface IBuyerOrderInput {
  status?: string;
  ordering?: string;
  page?: number;
}

declare interface IBuyerOrderResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IOrderData[];
}

declare interface IBuyerOrderInitialState {
  getAllBuyerOrdersLoading: boolean;
  getAllBuyerOrdersError: string;
  cancelBuyerOrderLoading: boolean;
  cancelBuyerOrderError: string;
  buyerOrders: IOrderData[];
  search: string;
  statusFilter: string;
  count: number;
  next: string | null;
  previous: string | null;
}
