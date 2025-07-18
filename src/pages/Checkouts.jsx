import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import StripeCheckout from '../components/StripeCheckOut';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const product = location.state?.product;

  if (!product) {
    navigate('/products');
    return null;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handlePaymentSuccess = () => {
    window.alert('Payment Successful!');
    setPaymentSuccess(true);
    setPaymentError('');
  };

  const handlePaymentError = (error) => {
    window.alert(`Payment Failed: ${error}`);
    setPaymentError(error);
    setPaymentSuccess(false);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. A confirmation email has been sent to the admin.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Order Details:</h3>
              <p className="text-sm text-gray-600">Product: {product.name}</p>
              <p className="text-sm text-gray-600">Amount: ₹{product.price}</p>
              <p className="text-sm text-gray-600">Customer: {user.displayName}</p>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Details */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Product Details</h2>
                <div className="border rounded-lg p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className="text-2xl font-bold text-indigo-600">₹{product.price}</span>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
                <div className="border rounded-lg p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing Information
                    </label>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm"><strong>Name:</strong> {user.displayName}</p>
                      <p className="text-sm"><strong>Email:</strong> {user.email}</p>
                    </div>
                  </div>

                  <StripeCheckout
                    product={product}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Card Information */}
        <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="font-semibold text-indigo-900 mb-2">Test Card Information</h3>
          <p className="text-sm text-indigo-800 mb-2">
            Use these test card details for testing payments:
          </p>
          <div className="text-sm text-indigo-700">
            <p><strong>Card Number:</strong> 4242 4242 4242 4242</p>
            <p><strong>Expiry:</strong> Any future date</p>
            <p><strong>CVC:</strong> Any 3-digit number</p>
            <p><strong>ZIP:</strong> Any 5-digit number</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
