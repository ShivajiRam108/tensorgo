import { useState, useEffect } from 'react';
import { useAuth } from '../context/Authcontext';
import { Navigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { DollarSign, ShoppingBag, Users, TrendingUp, Mail, Calendar } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0
  });

  useEffect(() => {
    if (!isAdmin()) return;

    const q = query(collection(db, 'payments'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const paymentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      
      setPayments(paymentsData);
      calculateStats(paymentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const calculateStats = (paymentsData) => {
    const totalSales = paymentsData.reduce((sum, payment) => sum + payment.amount, 0);
    const totalOrders = paymentsData.length;
    const uniqueCustomers = new Set(paymentsData.map(payment => payment.userId)).size;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    setStats({
      totalSales,
      totalOrders,
      totalCustomers: uniqueCustomers,
      averageOrderValue
    });
  };

  const sendTestNotification = () => {
    const testPayment = {
      productName: 'Test Product',
      amount: 99.99,
      userName: 'Test User',
      userEmail: 'test@example.com',
      paymentMethodId: 'pm_test_123',
      timestamp: new Date()
    };

    console.log('Test email notification:', {
      to: import.meta.env.VITE_ADMIN_EMAIL,
      subject: `New Payment Received - ₹{testPayment.productName}`,
      body: `
        A new payment has been received:
        
        Product: ₹{testPayment.productName}
        Amount: ₹₹{testPayment.amount}
        Customer: ₹{testPayment.userName} (₹{testPayment.userEmail})
        Payment ID: ₹{testPayment.paymentMethodId}
        Date: ₹{testPayment.timestamp.toLocaleString()}
      `
    });

    alert('Test notification sent! Check the browser console for details.');
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user.displayName}! Here's your store overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalSales.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.averageOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Notification Button */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Email Notification Testing</h2>
          <p className="text-gray-600 mb-4">
            Test the email notification system. In a real application, this would send an email to: {import.meta.env.VITE_ADMIN_EMAIL}
          </p>
          <button
            onClick={sendTestNotification}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Mail className="w-4 h-4" />
            <span>Send Test Notification</span>
          </button>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            {payments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No orders yet. Start promoting your products!</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.userEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.productName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{payment.amount.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {payment.timestamp ? payment.timestamp.toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;