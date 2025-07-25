import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { StoreIcon, CartIcon, ReceiptIcon, SunIcon, MoonIcon, UserIcon, LogoutIcon } from './icons';
import { useStores } from '../context/StoreContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { cart } = useStores();
  const { theme, toggleTheme } = useTheme();
  const { profile, logout } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);
  
  const getLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base ${
      isActive
        ? 'bg-black/10 dark:bg-white/20 text-slate-900 dark:text-slate-50'
        : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-slate-100'
    }`;
    
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center p-4">
        <NavLink to="/" className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-slate-50">
          <StoreIcon className="w-8 h-8 text-brand-accent" />
          <span className="hidden sm:inline">Chennai Storefront</span>
        </NavLink>
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" className={getLinkClassName}>Home</NavLink>
          {profile && (profile.role === 'super-admin' || profile.role === 'manager') && (
            <NavLink to="/admin" className={getLinkClassName}>Admin</NavLink>
          )}
          {profile && <NavLink to="/orders" className={`${getLinkClassName} flex items-center gap-2`}><ReceiptIcon className="w-5 h-5" /><span className="hidden sm:inline">Orders</span></NavLink>}
          
          <NavLink to="/cart" className={({ isActive }) => `${getLinkClassName({ isActive })} p-2 relative`} aria-label={`Cart with ${totalItems} items`}>
            <CartIcon className="w-6 h-6" />
            {totalItems > 0 && <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white ring-2 ring-white/80 dark:ring-slate-800">{totalItems}</span>}
          </NavLink>
          
          <button onClick={toggleTheme} className="p-2 rounded-lg transition-colors duration-200 text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10" aria-label="Toggle theme">
            {theme === 'light' ? <MoonIcon className="w-6 h-6"/> : <SunIcon className="w-6 h-6"/>}
          </button>
          
          <div className="relative">
            {profile ? (
              <>
                <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-2 rounded-full transition-colors duration-200 text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10" aria-label="User menu">
                  <UserIcon className="w-6 h-6"/>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-lg shadow-lg py-2 z-50 animate-fade-in" style={{animationDuration: '150ms'}}>
                    <div className="px-4 py-2 border-b border-slate-200/80 dark:border-white/10">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Signed in as</p>
                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{profile.email}</p>
                    </div>
                    <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 flex items-center gap-3">
                      <LogoutIcon className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base bg-brand-primary text-white hover:bg-brand-secondary">
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;