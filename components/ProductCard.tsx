import React, { useState } from 'react';
import type { Product } from '../types';
import { TrashIcon } from './icons';
import { useStores } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  isAdminView?: boolean;
  onDelete?: () => void;
  index?: number; // New prop for stagger animation
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isAdminView = false, onDelete, index = 0 }) => {
  const { addToCart } = useStores();
  const [wasAdded, setWasAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setWasAdded(true);
    setTimeout(() => {
      setWasAdded(false);
    }, 2000);
  };

  const animationStyle = {
    animationDelay: `${index * 75}ms`,
    animationFillMode: 'backwards',
  } as React.CSSProperties;

  return (
    <div 
      className="bg-white/60 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col backdrop-blur-xl animate-stagger-item-enter"
      style={animationStyle} // Apply animation style
    >
      <div className="relative">
        <img className="w-full h-48 object-cover" src={product.imageUrl} alt={product.name} />
        {isAdminView && onDelete && (
          <button 
            onClick={onDelete} 
            className="absolute top-3 right-3 bg-red-600/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700 backdrop-blur-sm"
            aria-label="Delete product"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 mb-1">{product.name}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-grow">{product.description}</p>
        <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-brand-accent">₹{product.price.toFixed(2)}</span>
            {!isAdminView && (
              <button
                onClick={handleAddToCart}
                disabled={wasAdded}
                className={`text-white px-5 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${
                  wasAdded 
                    ? 'bg-green-500 cursor-default' 
                    : 'bg-brand-primary hover:bg-brand-secondary'
                }`}
              >
                {wasAdded ? 'Added!' : 'Add to Cart'}
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;