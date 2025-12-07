export interface Press {
  id: string;
  name: string;
  location: string;
  capacity?: number;
}

export interface Facility {
  id: string;
  name: string;
  location: string;
  type: 'Bottler' | 'Buyer' | 'Storage';
}

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  status: 'In Transit' | 'Delivered' | 'Pending';
  date: string;
  driver_name?: string;
}

export interface User {
  id: number;
  name: string;
  created_at?: string;
}

export interface OliveBatch {
  id?: string;
  weight_kg: number;
  press_id: string;
  user_id: string | number;
  created_at?: string;
}

export interface OilBatch {
  id?: string;
  volume_liters: number;
  facility_id: string;
  user_id: string | number;
  created_at?: string;
}

export type TabView = 'order' | 'network' | 'trips';
export type OrderType = 'olives' | 'oil';