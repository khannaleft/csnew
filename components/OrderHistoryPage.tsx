import React, { useState } from 'react';
import { useStores } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { ReceiptIcon, PlusIcon, MinusIcon } from './icons';

const OrderHistoryPage: React.FC = () => {
  const { orders, loading } = useStores();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  React.useEffect(() => {
    if (!loading && orders.length > 0 && !expandedOrderId) {
      setExpandedOrderId(orders[0].id);
    }
  }, [loading, orders, expandedOrderId]);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };
  
  const getStaggerStyle = (index: number) => ({
    animationDelay: `${index * 50}ms`,
    animationFillMode: 'backwards',
  } as React.CSSProperties);
  
  if (loading) {
    return (
      <div className="text-center py-16">
        <p>Loading order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 bg-white/60 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl rounded-2xl">
        <ReceiptIcon className="mx-auto w-24 h-24 text-slate-400 dark:text-slate-500 opacity-50" />
        <h1 className="text-4xl font-bold mt-4">No Order History</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">You haven't placed any orders yet.</p>
        <Link to="/" className="mt-6 inline-block bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-secondary transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-8">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order, i) => (
          <div 
            key={order.id} 
            className="bg-white/60 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl rounded-2xl shadow-md overflow-hidden transition-all duration-300 animate-stagger-item-enter"
            style={getStaggerStyle(i)}
          >
            <button
              onClick={() => toggleOrderExpansion(order.id)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <div>
                <p className="font-bold text-lg">Order #{order.id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg text-brand-accent">₹{order.total.toFixed(2)}</span>
                {expandedOrderId === order.id ? <MinusIcon className="w-6 h-6 text-slate-500 dark:text-slate-400"/> : <PlusIcon className="w-6 h-6 text-slate-500 dark:text-slate-400"/>}
              </div>
            </button>

            {expandedOrderId === order.id && (
              <div className="p-5 border-t border-slate-200/80 dark:border-white/10 bg-black/5 dark:bg-black/20 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold mb-3 text-slate-900 dark:text-slate-50">Items ({order.items.reduce((acc, i) => acc + i.quantity, 0)})</h3>
                    <ul className="space-y-2">
                      {order.items.map(item => (
                        <li key={item.id} className="flex justify-between text-sm">
                          <div className="text-slate-700 dark:text-slate-300">
                            <span className="font-semibold">{item.name}</span>
                            <span className="text-slate-500 dark:text-slate-400"> &times; {item.quantity}</span>
                          </div>
                          <span className="font-medium text-slate-800 dark:text-slate-200">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold mb-3 text-slate-900 dark:text-slate-50">Shipped To</h3>
                    <address className="not-italic text-sm text-slate-600 dark:text-slate-400">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{order.shipping_address.fullName}</p>
                      <p>{order.shipping_address.street}</p>
                      <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                      <p>{order.shipping_address.country}</p>
                      <p>{order.shipping_address.phone}</p>
                    </address>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;