import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStores } from '../context/StoreContext';
import { TrashIcon, PlusIcon, CartIcon, MinusIcon, TruckIcon, CreditCardIcon, SparklesIcon } from './icons';
import Modal from './Modal';
import type { Address } from '../types';


// Helper components for the modal form
const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="w-full bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-accent focus:outline-none transition" />
);

const StepperIcon: React.FC<{isCompleted: boolean, isActive: boolean, children: React.ReactNode}> = ({isCompleted, isActive, children}) => (
    <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 transition-colors ${isActive ? 'bg-brand-primary text-white' : isCompleted ? 'bg-brand-secondary text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
        {children}
    </span>
);

const StepperLine: React.FC<{isCompleted: boolean}> = ({isCompleted}) => (
  <div className={`flex w-full h-1 rounded-full mx-2 ${isCompleted ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-700'}`} />
);


// Checkout Modal Component
const CheckoutModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { cart, placeOrder } = useStores();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review
    const [isProcessing, setIsProcessing] = useState(false);
    const [address, setAddress] = useState<Address>({
        fullName: '', street: '', city: 'Chennai', state: 'TN', zip: '', country: 'India', phone: ''
    });
    
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleClose = () => {
        onClose();
        // Reset state when closing
        setTimeout(() => {
            setStep(1);
            setIsProcessing(false);
        }, 300);
    };

    const handleAddressSubmit = (e: FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSubmit = (e: FormEvent) => {
        e.preventDefault();
        setStep(3);
    };

    const handlePlaceOrder = () => {
        setIsProcessing(true);
        setTimeout(() => {
            placeOrder(address);
            setIsProcessing(false);
            handleClose();
            navigate('/orders');
        }, 1500);
    };
    
    const renderInput = (id: keyof Address, label: string, type = 'text', required = true) => (
      <div className="mb-4">
          <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{label}</label>
          <FormInput
              type={type}
              id={id}
              name={id}
              value={address[id]}
              onChange={(e) => setAddress({ ...address, [id]: e.target.value })}
              required={required}
          />
      </div>
    );

    const renderMockPaymentInput = (id: string, label: string, placeholder:string) => (
       <div className="mb-4">
          <label htmlFor={id} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{label}</label>
          <FormInput type="text" id={id} placeholder={placeholder} required />
        </div>
    );
    
    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Checkout">
            <div className="w-full max-w-2xl mx-auto mb-8">
                <div className="flex items-center w-full">
                    <StepperIcon isCompleted={step > 1} isActive={step === 1}><TruckIcon className="w-5 h-5" /></StepperIcon>
                    <StepperLine isCompleted={step > 1} />
                    <StepperIcon isCompleted={step > 2} isActive={step === 2}><CreditCardIcon className="w-5 h-5" /></StepperIcon>
                    <StepperLine isCompleted={step > 2} />
                    <StepperIcon isCompleted={step === 3} isActive={step === 3}><SparklesIcon className="w-5 h-5" /></StepperIcon>
                </div>
            </div>

            {step === 1 && (
                <form onSubmit={handleAddressSubmit} className="animate-fade-in">
                    <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                    {renderInput('fullName', 'Full Name')}
                    {renderInput('street', 'Street Address')}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput('city', 'City')}
                        {renderInput('state', 'State / Province')}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {renderInput('zip', 'ZIP / Postal Code')}
                       {renderInput('country', 'Country')}
                    </div>
                     {renderInput('phone', 'Phone Number', 'tel')}
                    <div className="flex justify-end mt-6">
                        <button type="submit" className="bg-brand-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-brand-secondary transition-colors">Next: Payment</button>
                    </div>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handlePaymentSubmit} className="animate-fade-in">
                    <h2 className="text-xl font-bold mb-4">Payment Details</h2>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300 bg-yellow-500/10 dark:bg-yellow-500/20 border border-yellow-400/20 dark:border-yellow-400/30 rounded-lg p-3 mb-6">This is a demo. Do not enter real credit card information.</p>
                    {renderMockPaymentInput('cardNumber', 'Card Number', '**** **** **** 1234')}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {renderMockPaymentInput('expiryDate', 'Expiry Date', 'MM / YY')}
                       {renderMockPaymentInput('cvc', 'CVC', '***')}
                    </div>
                    <div className="flex justify-between mt-6">
                        <button type="button" onClick={() => setStep(1)} className="bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-white font-bold py-2.5 px-6 rounded-xl dark:hover:bg-slate-500 transition-colors">Back</button>
                        <button type="submit" className="bg-brand-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-brand-secondary transition-colors">Next: Review</button>
                    </div>
                </form>
            )}

            {step === 3 && (
                <div className="animate-fade-in">
                    <h2 className="text-xl font-bold mb-4">Review Your Order</h2>
                    <div className="space-y-3">
                        <div className="bg-slate-100 dark:bg-slate-900/70 p-4 rounded-xl">
                            <h3 className="font-bold text-base mb-2">Shipping To:</h3>
                            <address className="not-italic text-sm text-slate-600 dark:text-slate-300">
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{address.fullName}</p>
                                <p>{address.street}, {address.city}, {address.state} {address.zip}</p>
                                <p>{address.phone}</p>
                            </address>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-900/70 p-4 rounded-xl">
                            <h3 className="font-bold text-base mb-2">Items:</h3>
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center py-1 text-sm">
                                    <span className="text-slate-700 dark:text-slate-300">{item.name} x {item.quantity}</span>
                                    <span className="text-slate-800 dark:text-slate-100">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-right font-bold text-xl mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                            <span className="text-slate-600 dark:text-slate-400 mr-2">Total:</span> 
                            <span className="text-brand-accent">₹{subtotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between mt-8">
                        <button type="button" onClick={() => setStep(2)} className="bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-600 dark:text-white font-bold py-2.5 px-6 rounded-xl dark:hover:bg-slate-500 transition-colors">Back</button>
                        <button onClick={handlePlaceOrder} disabled={isProcessing} className="bg-green-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-green-500 transition-colors disabled:bg-gray-500 disabled:cursor-wait flex items-center gap-2">
                            {isProcessing && <SparklesIcon className="w-5 h-5 animate-pulse" />}
                            {isProcessing ? 'Processing...' : 'Confirm Purchase'}
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};


// Main Cart Page Component
const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart } = useStores();
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getStaggerStyle = (index: number) => ({
    animationDelay: `${index * 50}ms`,
    animationFillMode: 'backwards',
  } as React.CSSProperties);

  if (cart.length === 0) {
    return (
      <div className="text-center py-16 bg-white/60 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl rounded-2xl">
        <CartIcon className="mx-auto w-24 h-24 text-slate-400 dark:text-slate-500 opacity-50" />
        <h1 className="text-4xl font-bold mt-4">Your Cart is Empty</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="mt-6 inline-block bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-secondary transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-8">Your Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-grow bg-white/60 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl rounded-2xl shadow-md lg:w-2/3">
          <ul className="divide-y divide-slate-200/80 dark:divide-white/10">
            {cart.map((item, i) => (
              <li 
                key={item.id} 
                className="p-4 flex flex-col sm:flex-row items-center gap-4 animate-stagger-item-enter"
                style={getStaggerStyle(i)}
              >
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-2 rounded-full bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <MinusIcon className="w-4 h-4"/>
                  </button>
                  <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                   <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-2 rounded-full bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                    <PlusIcon className="w-4 h-4"/>
                   </button>
                </div>
                <p className="w-24 text-right font-semibold text-lg text-brand-accent">₹{(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors" aria-label={`Remove ${item.name} from cart`}>
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white/60 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl rounded-2xl shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold border-b border-slate-200/80 dark:border-white/10 pb-4 mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2 text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-slate-600 dark:text-slate-400">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between font-bold text-xl border-t border-slate-200/80 dark:border-white/10 pt-4 mt-4">
              <span>Total</span>
              <span className="text-brand-accent">₹{subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setCheckoutModalOpen(true)}
              className="block text-center w-full mt-6 bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-secondary transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
      <CheckoutModal isOpen={isCheckoutModalOpen} onClose={() => setCheckoutModalOpen(false)} />
    </div>
  );
};

export default CartPage;