// Definição de um Serviço prestado por um profissional
export interface Service {
  id: string | number;
  name: string;
  price: number;
  duration: string;
}

// Definição de um Profissional e seus dados
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

// Definição de um Agendamento
export interface Appointment {
  id: number;
  salon: string;
  service: string;
  price: number;
  date: string;
  status: string;
  clientName?: string;
}

// Definição do Endereço da empresa
export interface Address {
  street: string;
  number: string;
  city: string;
  zip: string;
}

// Definição dos Dados da Empresa (usado no Dashboard)
export interface CompanyData {
  address: Address;
  gallery: string[];
  professionals: Professional[];
  hours?: any; // Objeto com os horários de cada dia
}