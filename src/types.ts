import { MenuItem } from "./menuData";

export type OrderType = "dine-in" | "takeaway" | "delivery";

export interface CartItem {
  id?: string;
  item: MenuItem;
  quantity: number;
  selectedSpiceLevel?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}

export interface OrderConfirmation {
  orderId: string;
  eta: string;
  paymentMethod: string;
  customer: {
    name: string;
    phone: string;
    address?: string;
  };
  totals: {
    itemsTotal: number;
    packagingCharge: number;
    deliveryCharge: number;
    totalAmount: number;
  };
}
