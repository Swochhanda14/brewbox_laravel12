import React, { useMemo, useState } from "react";
import { FaTimes, FaList } from "react-icons/fa";
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
		<div className="">
			<div className="justify-between">
				<div className="flex justify-between">
					<div className="flex items-center text-2xl gap-2">
						<FaList />
						<p>Subscription List</p>
					</div>
					<div className="my-4 text-md">
						<label className="mr-2 font-medium">
							Filter by Delivered Status:
						</label>
						<select
							value={deliveredFilter}
							onChange={(e) => setDeliveredFilter(e.target.value)}
							className="border rounded px-2 py-1"
						>
							<option value="all">All</option>
							<option value="delivered">Delivered</option>
							<option value="notDelivered">Not Delivered</option>
						</select>
					</div>
				</div>
				{isLoading ? (
					<>Loading...</>
				) : error ? (
					<>{
                        typeof error === 'string'
                            ? error
                            : error?.data?.message || error?.error || JSON.stringify(error)
                    }</>
				) : (
					<div className="overflow-hidden mt-10 ">
						<table className=" min-w-full rounded-xl">
							<thead>
								<tr className="bg-gray-50 uppercase">
									<th
										scope="col"
										className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl"
									>
										{" "}
										Id{" "}
									</th>
									<th
										scope="col"
										className="p-5 text-left text-sm leading-6 font-semibold text-gray-900"
									>
										{" "}
										User{" "}
									</th>
									<th
										scope="col"
										className="p-5 text-left text-sm leading-6 font-semibold text-gray-900"
									>
										{" "}
										Date{" "}
									</th>
									<th
										scope="col"
										className="p-5 text-left text-sm leading-6 font-semibold text-gray-900"
									>
										{" "}
										Total{" "}
									</th>
									<th
										scope="col"
										className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl"
									>
										{" "}
										Payment Method{" "}
									</th>
									<th
										scope="col"
										className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl"
									>
										{" "}
										Delivered{" "}
									</th>
									<th
										scope="col"
										className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl"
									>
										{" "}
										Ending Date{" "}
									</th>
									<th
										scope="col"
										className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl"
									>
										Next Delivery Date
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-300 ">
								{filteredOrders.map((order) => {
									const duration = getSubscriptionDuration(order);
									const createdAt = order.createdAt ?? order.created_at;
									const endingDate = createdAt ? getEndingDate(createdAt, duration) : "-";
									const nextDelivery = getNextDeliveryDate(
										createdAt,
										duration
									);
									return (
										<tr
											key={order._id ?? order.id}
											className="bg-white transition-all duration-500 hover:bg-gray-50"
										>
											<td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
												{order._id ?? order.id}
											</td>
											<td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
												{order.user && order.user.name}
											</td>
											<td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
												{createdAt ? createdAt.substring(0, 10) : "-"}
											</td>
											<td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
												Rs. {order.totalPrice ?? order.total_price}
											</td>
											<td className="uppercase p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
												{order.paymentMethod ?? order.payment_method}
											</td>
											<td className="uppercase p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
												{(order.isDelivered ?? order.is_delivered) ? (
													(order.deliveredAt ?? order.delivered_at)?.substring(0, 10)
												) : (
													<FaTimes className="text-red-600" />
												)}
											</td>
											<td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
												{endingDate}
											</td>
											<td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
												{nextDelivery}
											</td>
											<td>
												<Link to={`/admin/order/${order._id ?? order.id}`}>
													<button className="px-4 py-2 rounded bg-gray-200 hover:cursor-pointer">
														Details
													</button>
												</Link>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminSubscriptionList;
