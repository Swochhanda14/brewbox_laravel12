import React, { useMemo, useState } from "react";
import { FaTimes, FaList, FaSpinner, FaFilter, FaEye } from "react-icons/fa";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import { Link } from "react-router-dom";

const AdminSubscriptionList = () => {
	// const { pageNumber } = useParams();

	const {
		data: orders,
		isLoading,
		error,
		refetch,
	} = useGetOrdersQuery({
		// pageNumber,
	});

	const subscriptionOrders = useMemo(() => {
		if (!orders || !Array.isArray(orders)) return [];
		return orders
			.map(order => {
				const orderItems = Array.isArray(order.orderItems)
					? order.orderItems
					: Array.isArray(order.order_items)
						? order.order_items
						: [];
				const hasSubscription = orderItems.some(
					(item) => item.product && item.product.category === "Subscription"
				);
				return hasSubscription ? { ...order, orderItems } : null;
			})
			.filter(Boolean);
	}, [orders]);

	const getSubscriptionDuration = (order) => {
		// Find the first subscription item
		const subItem = order.orderItems.find(
			(item) => item.product && item.product.category === "Subscription"
		);

		// console.log(subItem);
		// Extract duration from product name (e.g., '3 Months Subscription')
		if (subItem && typeof subItem.name === "string") {
			const match = subItem.name.match(/(\d+)\s*months?/i);
			if (match) {
				return parseInt(match[1], 10);
			}
		}
		return 3; // fallback to 3 months if not found
	};

	const getEndingDate = (createdAt, duration) => {
		const date = new Date(createdAt);
		date.setMonth(date.getMonth() + duration);
		return date.toISOString().substring(0, 10);
	};

	const getNextDeliveryDate = (createdAt, duration) => {
		const now = new Date();
		const start = new Date(createdAt);
		// Calculate the ending date
		const end = new Date(start);
		end.setMonth(end.getMonth() + duration);
		// If subscription already ended, return '-'
		if (now >= end) return "-";
		// Find the next delivery date after now, but before end
		let next = new Date(start);
		while (next <= now && next < end) {
			next.setMonth(next.getMonth() + 1);
		}
		// If next delivery is after end, return '-'
		if (next > end) return "-";
		return next.toISOString().substring(0, 10);
	};

	const [deliveredFilter, setDeliveredFilter] = useState("all");

	const filteredOrders = useMemo(() => {
		if (deliveredFilter === "all") return subscriptionOrders;
		if (deliveredFilter === "delivered")
			return subscriptionOrders.filter((o) => o.isDelivered ?? o.is_delivered);
		if (deliveredFilter === "notDelivered")
			return subscriptionOrders.filter((o) => !(o.isDelivered ?? o.is_delivered));
		return subscriptionOrders;
	}, [subscriptionOrders, deliveredFilter]);

	return (
		<div className="w-full">
			<div className="mb-8">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<FaList className="text-green-700 text-xl" />
						</div>
						<div>
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Subscription List</h2>
							<p className="text-gray-600 text-sm">Manage subscription orders</p>
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
							<option value="all">All Subscriptions</option>
							<option value="delivered">Delivered</option>
							<option value="notDelivered">Not Delivered</option>
						</select>
					</div>
				</div>
				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-20">
						<FaSpinner className="text-5xl text-green-700 animate-spin mb-4" />
						<p className="text-gray-600">Loading subscriptions...</p>
					</div>
				) : error ? (
					<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
						<p className="text-red-600">
							{typeof error === 'string'
								? error
								: error?.data?.message || error?.error || JSON.stringify(error)}
						</p>
					</div>
				) : filteredOrders.length === 0 ? (
					<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
						<FaList className="text-5xl text-gray-400 mx-auto mb-4" />
						<p className="text-xl font-semibold text-gray-800 mb-2">No subscriptions found</p>
						<p className="text-gray-600">There are no subscriptions matching your filter criteria.</p>
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
											Ending Date
										</th>
										<th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
											Next Delivery
										</th>
										<th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{filteredOrders.map((order) => {
										const duration = getSubscriptionDuration(order);
										const createdAt = order.createdAt ?? order.created_at;
										const endingDate = createdAt ? getEndingDate(createdAt, duration) : "-";
										const nextDelivery = getNextDeliveryDate(createdAt, duration);
										return (
											<tr key={order._id ?? order.id} className="hover:bg-gray-50 transition-colors duration-200">
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
													#{order._id ?? order.id}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
													{order.user && order.user.name}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
													{createdAt ? createdAt.substring(0, 10) : "-"}
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
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
													{endingDate}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
													{nextDelivery}
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
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminSubscriptionList;
