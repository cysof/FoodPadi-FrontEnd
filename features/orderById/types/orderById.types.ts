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