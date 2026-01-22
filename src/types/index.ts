// src/types/index.ts

// 1. Tipos Básicos
export interface Service {
  id: string | number;
  name: string;
  price: number;
  duration: string;
}

export interface Professional {
  id: string | number;
  name: string;
  role: string;
  specialty?: string;
  image: string;
  rating: number;
  distance?: string;
  services?: Service[];
}

// 2. Tipos que estavam faltando (CompanyData e Appointment)
export interface Appointment {
  id: number;
  salon: string;
  service: string;
  price: number;
  date: string;
  status: string;
  clientName?: string;
}

export interface Address {
  street: string;
  number: string;
  city: string;
  zip: string;
}

export interface CompanyData {
  address: Address;
  gallery: string[];
  professionals: Professional[];
  hours?: any;
}