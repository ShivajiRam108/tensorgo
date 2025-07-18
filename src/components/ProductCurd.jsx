import { useAuth } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout', { state: { product } });
  };

  return (
    <div className="bg-[#f9fafb] rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-52 object-cover rounded-t-xl"
      />
      <div className="p-5">
        <h3 className="text-xl font-semibold text-[#1f2937] mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-emerald-600">₹ {product.price}</span>
          <button
            onClick={handleBuyNow}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition duration-200 shadow-sm"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
