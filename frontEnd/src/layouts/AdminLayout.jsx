import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { FaBell } from 'react-icons/fa';
import { useGetOrdersQuery } from '../slices/ordersApiSlice';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setCredentials(null));
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

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between py-8 px-4 min-h-screen">
        <div>
          <div className="mb-10 text-2xl font-bold text-green-400 text-center">BrewBox - Admin</div>
          <nav className="flex flex-col gap-6">
            <Link to="/admin/dashboard" className="hover:text-green-400">Dashboard</Link>
            <Link to="/admin/productlist" className="hover:text-green-400">Products</Link>
            <Link to="/admin/orderlist" className="hover:text-green-400">Orders</Link>
            <Link to="/admin/subscriptionlist" className="hover:text-green-400 flex items-center gap-2">
              Subscriptions
              {hasNotDeliveredSubscription && (
                <FaBell className="text-yellow-400 animate-bounce" title="Not delivered subscriptions!" />
              )}
            </Link>
            <Link to="/admin/userlist" className="hover:text-green-400">Users</Link>
            <button
          onClick={handleLogout}
          className="mt-10 w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
        >
          Logout
        </button>
          </nav>
        </div>
        
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
