import React, { useState,useEffect, useMemo } from 'react'
import {FaTimes, FaList, FaSpinner, FaFilter, FaEye} from 'react-icons/fa'
import {useGetOrdersQuery} from '../../slices/ordersApiSlice'
import { Link } from 'react-router-dom';

const AdminOrderList = () => {
	const { data: orders = [], isLoading, error, refetch } = useGetOrdersQuery({});

  const normalizedOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    return orders.map(order => {
      const orderItems = Array.isArray(order.orderItems)
        ? order.orderItems
        : Array.isArray(order.order_items)
          ? order.order_items
          : [];
      const hasCoffee = orderItems.some(item => item.product && item.product.category === 'Coffee');
      return hasCoffee ? { ...order, orderItems } : null;
    }).filter(Boolean);
  }, [orders]);

  const [deliveredFilter, setDeliveredFilter] = useState("all");
  
	const filteredOrders = useMemo(() => {
		if (deliveredFilter === "all") return normalizedOrders;
		if (deliveredFilter === "delivered")
			return normalizedOrders.filter((o) => o.isDelivered ?? o.is_delivered);
		if (deliveredFilter === "notDelivered")
			return normalizedOrders.filter((o) => !(o.isDelivered ?? o.is_delivered));
		return normalizedOrders;
	}, [normalizedOrders, deliveredFilter]);

  return (
    <div className="w-full">
			<div className="mb-8">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<FaList className="text-green-700 text-xl" />
						</div>
						<div>
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Orders List</h2>
							<p className="text-gray-600 text-sm">Manage and track all orders</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<FaFilter className="text-gray-600" />
						<label className="text-sm font-semibold text-gray-700">
							Filter:
						</label>
						<select
							value={deliveredFilter}
							onChange={(e) => setDeliveredFilter(e.target.value)}
							className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
						>
							<option value="all">All Orders</option>
							<option value="delivered">Delivered</option>
							<option value="notDelivered">Not Delivered</option>
						</select>
					</div>
				</div>
                {isLoading ? (
					<div className="flex flex-col items-center justify-center py-20">
						<FaSpinner className="text-5xl text-green-700 animate-spin mb-4" />
						<p className="text-gray-600">Loading orders...</p>
					</div>
				) : error ? (
					<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
						<p className="text-red-600">{error?.data?.message || error?.error || "Failed to load orders"}</p>
					</div>
				) : filteredOrders.length === 0 ? (
					<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
						<FaList className="text-5xl text-gray-400 mx-auto mb-4" />
						<p className="text-xl font-semibold text-gray-800 mb-2">No orders found</p>
						<p className="text-gray-600">There are no orders matching your filter criteria.</p>
					</div>
				) : (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gradient-to-r from-gray-50 to-gray-100">
									<tr>
										<th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
											Order ID
										</th>
										<th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
											User
										</th>
										<th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
											Date
										</th>
										<th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
											Total
										</th>
										<th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
											Payment
										</th>
										<th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
											Status
										</th>
										<th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{filteredOrders.map((order) => (
										<tr key={order._id ?? order.id} className="hover:bg-gray-50 transition-colors duration-200">
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												#{order._id ?? order.id}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
												{order.user && order.user.name}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
												{(order.createdAt ?? order.created_at)?.substring(0,10)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
												Rs. {order.totalPrice ?? order.total_price}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 uppercase">
													{order.paymentMethod ?? order.payment_method}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												{(order.isDelivered ?? order.is_delivered) ? (
													<span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
														{(order.deliveredAt ?? order.delivered_at)?.substring(0, 10)}
													</span>
												) : (
													<span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 flex items-center gap-1 w-fit">
														<FaTimes className="text-xs" />
														Pending
													</span>
												)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<Link to={`/admin/order/${order._id ?? order.id}`}>
													<button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2">
														<FaEye />
														View
													</button>
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
                )}
			</div>
		</div>
  )
}

export default AdminOrderList
