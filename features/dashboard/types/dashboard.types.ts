// features/dashboard/types/dashboard.types.ts

declare interface IRecentOrder {
  order_id: number;
  crop_name: string;
  buyer_name: string;
  quantity: number;
  total_price: number;
  status: string;
  ordered_at: string;
}

declare interface IFarmerDashboard {
  total_crops: number;
  total_orders: number;
  total_revenue: number;
  pending_revenue: number;
  status_breakdown: {
    PENDING?: number;
    CONFIRMED?: number;
    SHIPPED?: number;
    DELIVERED?: number;
    CANCELLED?: number;
  };
  recent_orders: IRecentOrder[];
}

declare interface IBuyerDashboard {
  total_orders: number;
  total_spent: number;
  status_breakdown: {
    PENDING?: number;
    CONFIRMED?: number;
    SHIPPED?: number;
    DELIVERED?: number;
    CANCELLED?: number;
  };
  recent_orders: IRecentOrder[];
}

declare interface ITransporterDelivery {
  id: number;
  delivery_status: string;
  delivery_address: string;
  delivery_date: string;
  accepted_at: string | null;
  delivered_at: string | null;
  proof_of_delivery_image: string | null;
  crop_name: string;
  buyer_name: string;
  created_at: string;
  updated_at: string;
}

declare interface ITransporterDashboard {
  count: number;
  next: string | null;
  previous: string | null;
  results: ITransporterDelivery[];
}

declare interface IDashboardInitialState {
  // Farmer
  farmerDashboard: IFarmerDashboard | null;
  farmerDashboardLoading: boolean;
  farmerDashboardError: string;

  // Buyer
  buyerDashboard: IBuyerDashboard | null;
  buyerDashboardLoading: boolean;
  buyerDashboardError: string;

  // Transporter
  transporterDashboard: ITransporterDashboard | null;
  transporterDashboardLoading: boolean;
  transporterDashboardError: string;
}