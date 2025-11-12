import React, { useMemo } from 'react';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { useGetUsersQuery } from '../../slices/usersApiSlice';
import { useGetProductsQuery } from '../../slices/productApiSlice';
import { Bar, Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import {
  FaBox,
  FaUsers,
  FaMoneyBillWave,
  FaClipboardList,
  FaStar,
  FaTruck,
  FaTimesCircle,
  FaUserPlus,
} from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetOrdersQuery({});
  const { data: users, isLoading: loadingUsers, error: errorUsers } = useGetUsersQuery({});
  const { data: productsData, isLoading: loadingProducts, error: errorProducts } = useGetProductsQuery({});
  const products = Array.isArray(productsData?.products)
    ? productsData.products
    : (Array.isArray(productsData) ? productsData : []);

  const stats = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return {
      totalOrders: 0, totalRevenue: 0, totalSubscriptions: 0, monthlyRevenue: [],
      topProduct: null, deliveredOrders: 0, notDeliveredOrders: 0, newUsers: 0, months: [], pendingSubscriptions: 0
    };

    const orderList = Array.isArray(orders) ? orders : [];
    const userList = Array.isArray(users) ? users : [];

    const totalOrders = orderList.length;
    const totalRevenue = orderList.reduce((sum, o) => {
      const val = Number(o.total_price ?? o.totalPrice ?? 0);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
    const totalSubscriptions = orderList.filter(order => {
      const items = Array.isArray(order.orderItems) ? order.orderItems : (Array.isArray(order.order_items) ? order.order_items : []);
      return items.some(item => item.product && item.product.category === 'Subscription');
    }).length;
    const deliveredOrders = orderList.filter(o => (o.is_delivered ?? o.isDelivered) === true).length;
    const notDeliveredOrders = orderList.filter(o => !(o.is_delivered ?? o.isDelivered)).length;

    let newUsers = 0;
    if (userList.length) {
      const thirtyDaysAgo = dayjs().subtract(30, 'day');
      newUsers = userList.filter(u => {
        const created = u.created_at ?? u.createdAt;
        return created ? dayjs(created).isAfter(thirtyDaysAgo) : false;
      }).length;
    }

    const months = Array.from({ length: 6 }, (_, i) =>
      dayjs().subtract(5 - i, 'month').format('YYYY-MM')
    );
    const monthlyRevenue = months.map(month => {
      const monthOrders = orderList.filter(o => {
        const created = o.created_at ?? o.createdAt;
        return created ? dayjs(created).format('YYYY-MM') === month : false;
      });
      return monthOrders.reduce((sum, o) => {
        const val = Number(o.total_price ?? o.totalPrice ?? 0);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
    });

    let productSales = {};
    orderList.forEach(order => {
      const items = Array.isArray(order.orderItems) ? order.orderItems : (Array.isArray(order.order_items) ? order.order_items : []);
      items.forEach(item => {
        const id = (item.product?.id ?? item.product?._id ?? item.product) ?? item.product_id ?? item.id;
        if (!id) return;
        if (!productSales[id]) productSales[id] = { qty: 0, name: item.name ?? item.product?.product_name ?? 'Unknown' };
        productSales[id].qty += Number(item.qty ?? item.quantity ?? 0);
      });
    });

    const topProduct = Object.values(productSales).sort((a, b) => b.qty - a.qty)[0] || null;

    const pendingSubscriptions = orderList.filter(order => {
      const delivered = order.is_delivered ?? order.isDelivered;
      const items = Array.isArray(order.orderItems) ? order.orderItems : (Array.isArray(order.order_items) ? order.order_items : []);
      return !delivered && items.some(item => item.product && item.product.category === 'Subscription');
    }).length;

    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
    const lowStockProducts = products.filter(p => {
      const stock = Number(p.count_in_stock ?? p.countInStock ?? p.countIn_stock ?? 0);
      return !isNaN(stock) && stock <= 5;
    });

    return {
      totalOrders,
      totalRevenue,
      totalSubscriptions,
      monthlyRevenue,
      months,
      topProduct,
      deliveredOrders,
      notDeliveredOrders,
      newUsers,
      pendingSubscriptions,
      averageOrderValue,
      lowStockProducts,
    };
  }, [orders, users, products]);

  const barChartData = {
    labels: ['Total Orders', 'Total Revenue', 'Subscriptions'],
    datasets: [
      {
        label: 'Stats',
        data: [stats.totalOrders, stats.totalRevenue, stats.totalSubscriptions],
        backgroundColor: ['#10b981', '#6366f1', '#f59e42'],
      },
    ],
  };

  const lineChartData = {
    labels: stats.months,
    datasets: [
      {
        label: 'Revenue by Month',
        data: stats.monthlyRevenue,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Overview of your business metrics</p>
      </div>

      {(loadingOrders || loadingUsers || loadingProducts) ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      ) : (errorOrders || errorUsers || errorProducts) ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">
            {errorOrders?.data?.message || errorOrders?.error || ''}
            {errorUsers?.data?.message || errorUsers?.error || ''}
            {errorProducts?.data?.message || errorProducts?.error || ''}
          </p>
        </div>
      ) : (
        <div className="w-full">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {[
              { label: 'Total Orders', value: stats.totalOrders, bgColor: 'from-blue-500 to-blue-600', icon: <FaClipboardList /> },
              { label: 'Total Revenue', value: `Rs. ${Number(stats.totalRevenue).toFixed(2)}`, bgColor: 'from-green-500 to-green-600', icon: <FaMoneyBillWave /> },
              { label: 'Total Users', value: users?.length || 0, bgColor: 'from-purple-500 to-purple-600', icon: <FaUsers /> },
              { label: 'Total Products', value: products?.length || 0, bgColor: 'from-orange-500 to-orange-600', icon: <FaBox /> },
              { label: 'Avg Order Value', value: `Rs. ${Number(stats.averageOrderValue || 0).toFixed(2)}`, bgColor: 'from-indigo-500 to-indigo-600', icon: <FaMoneyBillWave /> },
              { label: 'Pending Subscriptions', value: stats.pendingSubscriptions, bgColor: 'from-pink-500 to-pink-600', icon: <FaStar /> },
              { label: 'Delivered Orders', value: stats.deliveredOrders, bgColor: 'from-teal-500 to-teal-600', icon: <FaTruck /> },
              { label: 'Not Delivered', value: stats.notDeliveredOrders, bgColor: 'from-red-500 to-red-600', icon: <FaTimesCircle /> },
              { label: 'New Users (30d)', value: stats.newUsers, bgColor: 'from-cyan-500 to-cyan-600', icon: <FaUserPlus /> },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.bgColor} flex items-center justify-center text-white text-xl mb-4`}>
                  {card.icon}
                </div>
                <div className="text-sm font-semibold text-gray-600 mb-1">{card.label}</div>
                <div className="text-2xl font-bold text-gray-800">{card.value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Sales Overview</h3>
              <div className="min-h-[320px] sm:min-h-[400px]">
                <Bar
                  data={barChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                    scales: { y: { beginAtZero: true } },
                  }}
                  height={320}
                />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Revenue Trend</h3>
              <div className="min-h-[320px] sm:min-h-[400px]">
                <Line
                  data={lineChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                    scales: { y: { beginAtZero: true } },
                  }}
                  height={320}
                />
              </div>
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200 p-6 hover:shadow-xl transition-shadow">
              <div className="text-lg font-semibold mb-3 text-gray-800">Top Selling Product</div>
              {stats.topProduct ? (
                <div>
                  <div className="text-2xl font-bold text-blue-700">{stats.topProduct.name}</div>
                  <div className="text-gray-600 mt-1">Sold: {stats.topProduct.qty} units</div>
                </div>
              ) : (
                <div className="text-gray-500">No sales data available</div>
              )}
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-lg border border-indigo-200 p-6 hover:shadow-xl transition-shadow">
              <div className="text-lg font-semibold mb-3 text-gray-800">Total Subscriptions</div>
              <div className="text-3xl font-bold text-indigo-700">{stats.totalSubscriptions}</div>
            </div>
          </div>

          {stats.lowStockProducts && stats.lowStockProducts.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaBox className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Low Stock Alerts (≤ 5)</h3>
              </div>
              <div className="space-y-3">
                {stats.lowStockProducts.slice(0, 6).map((product) => (
                  <div
                    key={product.id ?? product._id}
                    className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <span className="font-medium text-gray-800 truncate pr-4">{product.product_name}</span>
                    <span className="px-3 py-1 bg-red-600 text-white rounded-full font-bold text-sm">
                      {Number(product.count_in_stock ?? product.countInStock ?? 0)} left
                    </span>
                  </div>
                ))}
              </div>
              {stats.lowStockProducts.length > 6 && (
                <p className="mt-4 text-sm text-gray-600 font-medium">
                  +{stats.lowStockProducts.length - 6} more low-stock products
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
