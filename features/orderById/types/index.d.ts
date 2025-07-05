declare interface IGetOrderInput {
  id: number;
}

declare interface IOrderByIdInitialState {
  getOneOrderLoading: boolean;
  getOneOrderError: string;
  order: IOrderData | null;
}
