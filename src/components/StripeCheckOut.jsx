// src/components/StripeCheckout.jsx
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useAuth } from '../context/Authcontext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { AlertCircle, CreditCard } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ product, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      });

      if (paymentError) throw paymentError;

      const paymentData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        productId: product.id,
        productName: product.name,
        amount: product.price,
        paymentMethodId: paymentMethod.id,
        status: 'completed',
        timestamp: serverTimestamp(),
      };

      console.log("💳 Payment Data to be saved:", paymentData);

      const docRef = await addDoc(collection(db, 'payments'), paymentData);
      console.log("✅ Firestore Document ID:", docRef.id);

      alert('✅ Payment Successful! Thank you for your purchase.');
      onSuccess();

    } catch (err) {
      console.error("❌ Payment or Firestore error:", err);
      setError(err.message);
      alert('❌ Payment Failed: ' + err.message);
      onError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        <div className="flex justify-between items-center">
          <span>{product.name}</span>
          <span className="font-bold">₹{product.price}</span>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Card Details
        </label>
        <div className="border rounded-md p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {processing ? (
          <span>Processing...</span>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Pay ₹{product.price}</span>
          </>
        )}
      </button>
    </form>
  );
};

const StripeCheckout = ({ product, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm product={product} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
};

export default StripeCheckout;
