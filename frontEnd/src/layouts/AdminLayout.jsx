import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { FaBell, FaTachometerAlt, FaBox, FaClipboardList, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { useGetOrdersQuery } from '../slices/ordersApiSlice';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(setCredentials(null));
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Fetch all orders to check for not delivered subscriptions
  const { data: orders } = useGetOrdersQuery();
  // Find if any subscription order is not delivered
  const hasNotDeliveredSubscription = Array.isArray(orders) && orders.some(order =>
    Array.isArray(order.orderItems) &&
    order.orderItems.some(item => item.product && item.product.category === 'Subscription') &&
    !order.isDelivered
  );

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col justify-between py-8 px-4 min-h-screen shadow-2xl sticky top-0">
        <div>
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              BrewBox
            </h1>
            <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
          </div>
          <nav className="flex flex-col gap-2">
            <Link 
              to="/admin/dashboard" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive('/admin/dashboard') 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <FaTachometerAlt />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link 
              to="/admin/productlist" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive('/admin/productlist') || location.pathname.includes('/admin/product')
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <FaBox />
              <span className="font-medium">Products</span>
            </Link>
            <Link 
              to="/admin/orderlist" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive('/admin/orderlist') || location.pathname.includes('/admin/order')
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <FaClipboardList />
              <span className="font-medium">Orders</span>
            </Link>
            <Link 
              to="/admin/subscriptionlist" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive('/admin/subscriptionlist')
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <span className="font-medium">Subscriptions</span>
                {hasNotDeliveredSubscription && (
                  <FaBell className="text-yellow-400 animate-bounce text-sm" title="Not delivered subscriptions!" />
                )}
              </div>
            </Link>
            <Link 
              to="/admin/userlist" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive('/admin/userlist') || location.pathname.includes('/admin/user')
                  ? 'bg-green-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <FaUsers />
              <span className="font-medium">Users</span>
            </Link>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
