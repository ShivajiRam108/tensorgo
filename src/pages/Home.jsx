import { Link } from 'react-router-dom';
import { products } from '../data/Product';
import ProductCard from '../components/ProductCurd';
import { ShoppingBag, Star, Users, Shield } from 'lucide-react';

const Home = () => {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Welcome to Our Premium Store
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            Explore high-quality products with secure payments and instant delivery notifications.
          </p>
          <Link
            to="/products"
            className="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-md inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Shop Now</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard icon={<Shield className="w-8 h-8 text-blue-600" />} title="Secure Payments" desc="Your payments are protected with industry-standard encryption." bg="bg-blue-100" />
            <FeatureCard icon={<Star className="w-8 h-8 text-yellow-500" />} title="Top Rated Products" desc="Carefully curated products from trusted brands and vendors." bg="bg-yellow-100" />
            <FeatureCard icon={<Users className="w-8 h-8 text-green-600" />} title="24/7 Support" desc="We’re always here to help you with any query or concern." bg="bg-green-100" />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
            <p className="text-gray-600">Check out our most loved products by customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-all duration-300 shadow"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Lifestyle?</h2>
          <p className="text-lg mb-6">Join thousands of happy customers. Shop now and experience quality and speed like never before.</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Start Shopping</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, bg }) => (
  <div className="text-center px-4">
    <div className={`₹{bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

export default Home; 
