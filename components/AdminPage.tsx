import React, { useState, useCallback, useEffect } from 'react';
import { useStores } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import ProductCard from './ProductCard';
import { generateProductDescription } from '../services/geminiService';
import { PlusIcon, TrashIcon, SparklesIcon, ArrowLeftIcon, StoreIcon } from './icons';
import type { Store, Profile } from '../types';

const AdminPage: React.FC = () => {
  const { stores, addStore, deleteStore, addProductToStore, deleteProductFromStore, getStoreById, loading, allManagers } = useStores();
  const { profile } = useAuth();
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [isStoreModalOpen, setStoreModalOpen] = useState(false);
  const [isProductModalOpen, setProductModalOpen] = useState(false);

  useEffect(() => {
    if (profile?.role === 'manager' && stores.length > 0) {
      setSelectedStoreId(stores[0].id);
    } else if (profile?.role === 'super-admin') {
      setSelectedStoreId(null);
    }
  }, [profile, stores]);

  const selectedStore = selectedStoreId ? getStoreById(selectedStoreId) : null;

  const handleSelectStore = (storeId: string) => setSelectedStoreId(storeId);
  const handleBackToDashboard = () => setSelectedStoreId(null);
  const handleDeleteStore = async (storeId: string) => {
    if (window.confirm('Are you sure you want to delete this store and all its products?')) {
      await deleteStore(storeId);
    }
  };
  const handleDeleteProduct = async (productId: string) => {
    if (selectedStoreId) await deleteProductFromStore(selectedStoreId, productId);
  };
  
  if (loading) return <div className="text-center p-12">Loading dashboard...</div>;

  const SuperAdminDashboard = () => (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <button onClick={() => setStoreModalOpen(true)} className="flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-5 rounded-xl hover:bg-brand-secondary transition-colors">
          <PlusIcon className="w-5 h-5" /> Create Store
        </button>
      </div>
      <div className="bg-white/60 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl rounded-2xl shadow-md">
        <ul className="divide-y divide-slate-200/80 dark:divide-white/10">
          {stores.map((store, i) => (
            <li key={store.id} className="p-4 flex justify-between items-center animate-stagger-item-enter" style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}>
              <div>
                <h3 className="text-xl font-semibold">{store.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{store.products?.length || 0} products</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manager: {allManagers.find(m => m.id === store.manager_id)?.email || 'Unassigned'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleSelectStore(store.id)} className="bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-white py-2 px-4 rounded-lg dark:hover:bg-slate-500 transition-colors">Manage</button>
                <button onClick={() => handleDeleteStore(store.id)} className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
          {stores.length === 0 && <li className="p-8 text-center text-slate-600 dark:text-slate-400">No stores found. Create one to get started!</li>}
        </ul>
      </div>
    </>
  );

  const StoreManager = ({ store }: { store: Store }) => (
    <>
      {profile?.role === 'super-admin' && (
        <button onClick={handleBackToDashboard} className="inline-flex items-center gap-2 text-brand-accent hover:underline mb-6 text-sm">
          <ArrowLeftIcon className="w-5 h-5" /> Back to Dashboard
        </button>
      )}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <StoreIcon className="w-10 h-10 text-brand-accent" />
          <h1 className="text-4xl font-bold">{store.name}</h1>
        </div>
        <button onClick={() => setProductModalOpen(true)} className="flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-5 rounded-xl hover:bg-brand-secondary transition-colors">
          <PlusIcon className="w-5 h-5" /> Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {(store.products || []).map((product, i) => (
          <ProductCard key={product.id} product={product} isAdminView={true} onDelete={() => handleDeleteProduct(product.id)} index={i}/>
        ))}
      </div>
      {(store.products?.length || 0) === 0 && <p className="col-span-full text-center text-xl text-slate-600 dark:text-slate-400 py-10 bg-white/60 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-white/10 backdrop-blur-xl">This store has no products yet. Add one!</p>}
    </>
  );

  return (
    <div>
      {profile?.role === 'super-admin' && !selectedStore && <SuperAdminDashboard />}
      {selectedStore && <StoreManager store={selectedStore} />}

      <CreateStoreModal 
        isOpen={isStoreModalOpen}
        onClose={() => setStoreModalOpen(false)}
        onSave={addStore}
        managers={allManagers}
      />
      {selectedStoreId && <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSave={(productData) => addProductToStore(selectedStoreId, productData)}
      />}
    </div>
  );
};

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="w-full bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-accent focus:outline-none transition" />
);

const FormTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} className="w-full bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-accent focus:outline-none transition" />
);

interface CreateStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string, description: string, manager_id?: string | null }) => void;
  managers: Profile[];
}

const CreateStoreModal: React.FC<CreateStoreModalProps> = ({ isOpen, onClose, onSave, managers }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [managerId, setManagerId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      onSave({ name, description, manager_id: managerId });
      setName('');
      setDescription('');
      setManagerId(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Store">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="storeName" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Store Name</label>
          <FormInput type="text" id="storeName" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label htmlFor="storeDescription" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Store Description</label>
          <FormTextArea id="storeDescription" value={description} onChange={e => setDescription(e.target.value)} rows={3} required />
        </div>
        <div className="mb-6">
            <label htmlFor="storeManager" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Assign Manager</label>
            <select
                id="storeManager"
                value={managerId || ''}
                onChange={e => setManagerId(e.target.value || null)}
                className="w-full bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-accent focus:outline-none transition"
            >
                <option value="">-- No Manager --</option>
                {managers.map(manager => (
                    <option key={manager.id} value={manager.id}>{manager.email}</option>
                ))}
            </select>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-white py-2 px-4 rounded-lg dark:hover:bg-slate-500 transition-colors">Cancel</button>
          <button type="submit" className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors">Create Store</button>
        </div>
      </form>
    </Modal>
  );
};

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string, price: number, description: string }) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDesc = useCallback(async () => {
    if (!name.trim()) {
      alert("Please enter a product name first.");
      return;
    }
    setIsGenerating(true);
    const generatedDesc = await generateProductDescription(name);
    setDescription(generatedDesc);
    setIsGenerating(false);
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceValue = parseFloat(price);
    if (name.trim() && !isNaN(priceValue) && description.trim()) {
      onSave({ name, price: priceValue, description });
      setName('');
      setPrice('');
      setDescription('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Product">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="productName" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Product Name</label>
          <FormInput type="text" id="productName" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label htmlFor="productPrice" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Price</label>
          <FormInput type="number" id="productPrice" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" />
        </div>
        <div className="mb-6 relative">
          <label htmlFor="productDescription" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Description</label>
          <FormTextArea id="productDescription" value={description} onChange={e => setDescription(e.target.value)} rows={4} required />
          <button type="button" onClick={handleGenerateDesc} disabled={isGenerating || !name.trim()} className="mt-2 flex items-center gap-2 text-sm text-brand-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
            {isGenerating ? (
              <>
                <SparklesIcon className="w-4 h-4 animate-pulse" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4" />
                <span>Generate with AI</span>
              </>
            )}
          </button>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-white py-2 px-4 rounded-lg dark:hover:bg-slate-500 transition-colors">Cancel</button>
          <button type="submit" className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors">Add Product</button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminPage;