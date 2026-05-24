declare interface getAllOrdersInitialState {
  getAllOrdersLoading: boolean;
  getAllOrdersError: string;
  orders: IOrderData[];
  search: string;
  count: number;
  next: string | null;
  previous: string | null;
}
