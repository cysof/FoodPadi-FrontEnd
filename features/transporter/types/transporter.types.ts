// features/transporter/types/transporter.types.ts

declare interface ITransporterDelivery {
  id: number;
  delivery_status: string;
  delivery_address: string;
  delivery_date: string;
  accepted_at: string | null;
  on_the_way_at: string | null;
  delivered_at: string | null;
  proof_of_delivery_image: string | null;
  cancel_reason: string | null;
  crop_name: string;
  buyer_name: string;
  created_at: string;
  updated_at: string;
}

declare interface ITransporterDashboardResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ITransporterDelivery[];
}

declare interface ITransporterDeliveryInput {
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
}

declare interface ICancelDeliveryInput {
  id: number;
  reason: string;
}

declare interface IDeliveryActionResponse {
  detail: string;
}

declare interface ITransporterInitialState {
  // Get all deliveries
  getAllDeliveriesLoading: boolean;
  getAllDeliveriesError: string;
  deliveries: ITransporterDelivery[];

  // Get one delivery
  getOneDeliveryLoading: boolean;
  getOneDeliveryError: string;
  selectedDelivery: ITransporterDelivery | null;

  // Accept delivery
  acceptDeliveryLoading: boolean;
  acceptDeliveryError: string;

  // Start delivery
  startDeliveryLoading: boolean;
  startDeliveryError: string;

  // Complete delivery
  completeDeliveryLoading: boolean;
  completeDeliveryError: string;

  // Cancel delivery
  cancelDeliveryLoading: boolean;
  cancelDeliveryError: string;

  // Reject delivery
  rejectDeliveryLoading: boolean;
  rejectDeliveryError: string;
}