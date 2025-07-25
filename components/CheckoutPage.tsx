import React, { useState, FormEvent } from 'react';
import { useStores } from '../context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';
import type { Address } from '../types';
import { TruckIcon, CreditCardIcon, SparklesIcon } from './icons';

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-brand-accent focus:outline-none transition" />
);

const CheckoutPage: React.FC = () => {
    const { cart, placeOrder } = useStores();
    const navigate = useNavigate();
    // 1: Address, 2: Payment, 3: Review
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    const [address, setAddress] = useState<Address>({
        fullName: '', street: '', city: 'Chennai', state: 'TN', zip: '', country: 'India', phone: ''
    });

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.length === 0 && !isProcessing) {
        return (
            <div className="text-center py-16 bg-white/60 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl rounded-2xl">
                <h1 className="text-3xl font-bold">Your cart is empty.</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Add items to your cart before proceeding to checkout.</p>
                <Link to="/" className="mt-6 inline-block bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-secondary transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

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

    const StepperIcon: React.FC<{isCompleted: boolean, isActive: boolean, children: React.ReactNode}> = ({isCompleted, isActive, children}) => (
        <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 transition-colors ${isActive ? 'bg-brand-primary text-white' : isCompleted ? 'bg-brand-secondary text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
            {children}
        </span>
    );
    
    const StepperLine: React.FC<{isCompleted: boolean}> = ({isCompleted}) => (
      <div className={`flex w-full h-1 rounded-full mx-2 ${isCompleted ? 'bg-brand-primary' : 'bg-slate-300 dark:bg-slate-700'}`} />
    );

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-8 text-center">Checkout</h1>
            
            <div className="w-full max-w-2xl mx-auto mb-10">
                <div className="flex items-center w-full">
                    <StepperIcon isCompleted={step > 1} isActive={step === 1}><TruckIcon className="w-6 h-6" /></StepperIcon>
                    <StepperLine isCompleted={step > 1} />
                    <StepperIcon isCompleted={step > 2} isActive={step === 2}><CreditCardIcon className="w-6 h-6" /></StepperIcon>
                    <StepperLine isCompleted={step > 2} />
                    <StepperIcon isCompleted={step === 3} isActive={step === 3}><SparklesIcon className="w-6 h-6" /></StepperIcon>
                </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl rounded-2xl shadow-md p-6 sm:p-8">
                {step === 1 && (
                    <form onSubmit={handleAddressSubmit} className="animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
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
                        <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
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
                        <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>
                        <div className="space-y-4">
                            <div className="bg-slate-100 dark:bg-slate-900/70 p-4 rounded-xl">
                                <h3 className="font-bold text-lg mb-2">Shipping To:</h3>
                                <p>{address.fullName}</p>
                                <p>{address.street}</p>
                                <p>{address.city}, {address.state} {address.zip}</p>
                                <p>{address.phone}</p>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-900/70 p-4 rounded-xl">
                                <h3 className="font-bold text-lg mb-2">Items:</h3>
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center py-1">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-right font-bold text-2xl mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
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
            </div>
        </div>
    );
};

export default CheckoutPage;