export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  store_id: string;
}

export interface Store {
  id:string;
  name: string;
  description: string;
  products: Product[];
  imageUrl: string;
  manager_id?: string | null;
}

export interface CartItem {
    id: string; // This is the product id
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  created_at: string;
  items: CartItem[];
  total: number;
  shipping_address: Address;
  user_id: string;
}

export interface Profile {
  id: string; // Corresponds to Supabase auth.user.id
  email: string;
  role: 'super-admin' | 'manager';
}