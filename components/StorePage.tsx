import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStores } from '../context/StoreContext';
import ProductCard from './ProductCard';
import { ArrowLeftIcon, StoreIcon } from './icons';

const StorePage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const { getStoreById } = useStores();
  
  if (!storeId) {
      return <div className="text-center text-red-500">Store ID is missing.</div>;
  }

  const store = getStoreById(storeId);

  if (!store) {
    return (
        <div className="text-center py-16 bg-white/60 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-white/10 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-red-500">Store not found</h2>
            <Link to="/" className="mt-4 inline-flex items-center gap-2 text-brand-accent hover:underline">
                <ArrowLeftIcon className="w-5 h-5" />
                Back to all stores
            </Link>
        </div>
    );
  }

  return (
    <div>
        <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-brand-accent hover:underline mb-8 text-sm">
                <ArrowLeftIcon className="w-5 h-5" />
                Back to all stores
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                <StoreIcon className="w-16 h-16 text-brand-accent flex-shrink-0"/>
                <div>
                    <h1 className="text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">{store.name}</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">{store.description}</p>
                </div>
            </div>
        </div>
      
      {store.products.length === 0 ? (
        <p className="text-center text-xl text-slate-600 dark:text-slate-400 py-10 bg-white/60 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-white/10 backdrop-blur-xl">This store has no products yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {store.products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StorePage;