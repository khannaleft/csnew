import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Store, Product, CartItem, Order, Address, Profile } from '../types';
import { useAuth } from './AuthContext';

interface StoreContextType {
  stores: Store[];
  loading: boolean;
  getStoreById: (storeId: string) => Store | undefined;
  addProductToStore: (storeId: string, productData: Omit<Product, 'id' | 'imageUrl' | 'store_id'>) => Promise<void>;
  deleteProductFromStore: (storeId: string, productId: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (shippingAddress: Address) => Promise<void>;
  allManagers: Profile[];
  addStore: (storeData: { name: string, description: string, manager_id?: string | null }) => Promise<void>;
  deleteStore: (storeId: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [allManagers, setAllManagers] = useState<Profile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('stores').select(`*, products(*)`).order('name');
    
    if (profile?.role === 'manager' && user) {
      query = query.eq('manager_id', user.id);
    }
    
    const { data, error } = await query;
    if (error) {
        console.error('Error fetching stores:', error);
        setStores([]);
    } else {
        setStores(data as Store[]);
    }
    setLoading(false);
  }, [profile, user]);

  const fetchManagers = useCallback(async () => {
    if (profile?.role === 'super-admin') {
      const { data, error } = await supabase.from('profiles').select('*').eq('role', 'manager');
      if (error) console.error('Error fetching managers', error);
      else setAllManagers(data || []);
    }
  }, [profile]);
  
  const fetchOrders = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if(error) console.error('Error fetching orders:', error);
    else setOrders((data as unknown as Order[]) || []);
  }, [user]);

  useEffect(() => {
    if (user && profile) {
        fetchStores();
        fetchManagers();
        fetchOrders();
    } else {
        setStores([]);
        setAllManagers([]);
        setOrders([]);
        setLoading(false);
    }
  }, [user, profile, fetchStores, fetchManagers, fetchOrders]);

  const getStoreById = (storeId: string): Store | undefined => {
    return stores.find(store => store.id === storeId);
  };
  
  const addStore = async (storeData: { name: string, description: string, manager_id?: string | null }) => {
    const { data, error } = await supabase.from('stores').insert({
        ...storeData,
        imageUrl: `https://picsum.photos/seed/store${Date.now()}/600/400`,
    }).select().single();
    if(error) {
      console.error("Error creating store", error);
      alert(error.message);
    }
    else if (data) {
        await fetchStores();
    }
  };

  const deleteStore = async (storeId: string) => {
    const { error } = await supabase.from('stores').delete().eq('id', storeId);
    if (error) {
      console.error("Error deleting store", error);
      alert(error.message);
    } else {
      setStores(prev => prev.filter(s => s.id !== storeId));
    }
  };
  
  const addProductToStore = async (storeId: string, productData: Omit<Product, 'id' | 'imageUrl' | 'store_id'>) => {
    const newProduct = { ...productData, store_id: storeId, imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300` };
    const { error } = await supabase.from('products').insert(newProduct);
    if(error) {
      console.error("Error adding product", error);
      alert(error.message);
    } else {
      await fetchStores();
    }
  };

  const deleteProductFromStore = async (storeId: string, productId: string) => {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if(error) {
      console.error("Error deleting product", error);
      alert(error.message);
    } else {
      await fetchStores();
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        const { store_id, ...cartProduct } = product; // eslint-disable-line @typescript-eslint/no-unused-vars
        return [...prevCart, { ...cartProduct, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.id !== productId));
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) removeFromCart(productId);
    else setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };
  const clearCart = () => setCart([]);

  const placeOrder = async (shippingAddress: Address) => {
    if (!user) {
        alert("You must be logged in to place an order.");
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderData = { user_id: user.id, items: cart, total, shipping_address: shippingAddress };
    const { error } = await supabase.from('orders').insert(orderData);
    if (error) {
      console.error("Error placing order:", error);
      alert(error.message);
    } else {
      await fetchOrders();
      clearCart();
    }
  };

  return (
    <StoreContext.Provider value={{
      stores, loading, getStoreById, addProductToStore, deleteProductFromStore,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      orders, placeOrder,
      allManagers, addStore, deleteStore
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = () => {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error('useStores must be used within a StoreProvider');
  return context;
};