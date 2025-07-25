import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStores } from '../context/StoreContext';
import { StoreIcon, SearchIcon } from './icons';

const HomePage: React.FC = () => {
  const { stores } = useStores();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStaggerStyle = (index: number) => ({
    animationDelay: `${index * 75}ms`,
    animationFillMode: 'backwards',
  } as React.CSSProperties);

  return (
    <div>
      <h1 className="text-5xl font-extrabold text-center mb-2 text-slate-900 dark:text-slate-50 tracking-tight">Welcome!</h1>
      <p className="text-center text-slate-600 dark:text-slate-400 mb-12 text-lg">Browse Our Collection of Unique Stores</p>
      
      <div className="mb-10 max-w-lg mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search for a store by name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/60 dark:bg-slate-800/50 border border-slate-300/70 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-brand-accent focus:outline-none transition shadow-sm backdrop-blur-xl"
            aria-label="Search for a store"
          />
        </div>
      </div>
      
      {/* Conditionally render Carousel or Search Results */}
      {searchQuery.trim() === '' ? (
        // Initial View: Show Carousel
        stores.length > 0 ? (
          <div className="mb-12">
              <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                  {stores.map((store, i) => (
                  <Link 
                    key={store.id} 
                    to={`/store/${store.id}`} 
                    className="block flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden shadow-lg group relative transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-stagger-item-enter"
                    style={getStaggerStyle(i)}
                  >
                      <img src={store.imageUrl} alt={store.name} className="w-full h-full object-cover group-hover:blur-[2px] transition-all duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                      <h3 className="text-white font-bold text-2xl tracking-tight drop-shadow-lg">{store.name}</h3>
                      </div>
                  </Link>
                  ))}
              </div>
          </div>
        ) : (
           <div className="text-center py-16 bg-white/60 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-white/10 backdrop-blur-xl">
              <StoreIcon className="mx-auto w-24 h-24 text-slate-400 dark:text-slate-500 opacity-50"/>
              <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
                No stores available right now.
              </p>
              <p className="text-slate-500 dark:text-slate-400">Admins can create one in the Admin Panel.</p>
          </div>
        )
      ) : (
        // Search View: Show Filtered List
        filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStores.map((store, i) => (
              <Link 
                key={store.id} 
                to={`/store/${store.id}`} 
                className="block bg-white/60 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-xl animate-stagger-item-enter"
                style={getStaggerStyle(i)}
              >
                  <div className="p-6">
                      <div className="flex items-center mb-4">
                          <StoreIcon className="w-10 h-10 text-brand-accent mr-4"/>
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{store.name}</h2>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">{store.description}</p>
                  </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/60 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-white/10 backdrop-blur-xl">
              <StoreIcon className="mx-auto w-24 h-24 text-slate-400 dark:text-slate-500 opacity-50"/>
              <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
                {`No stores found for "${searchQuery}"`}
              </p>
          </div>
        )
      )}
    </div>
  );
};

export default HomePage;