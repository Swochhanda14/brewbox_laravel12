import { React, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Banner from "../components/Banner";
import { useGetProductsQuery } from "../slices/productApiSlice.js";
import ProductCard from "../components/ProductCard.jsx";
import { FaSpinner, FaTimes, FaCoffee, FaCalendarAlt, FaGift, FaSyncAlt, FaCheckCircle } from "react-icons/fa";

const SubscriptionPage = (props) => {
	const [product, setProduct] = useState([]);
	const { pageNumber, keyword } = useParams();
	
	  const { data, isLoading, error } = useGetProductsQuery({
		keyword,
		pageNumber,
	  });

	useEffect(() => {
		if (data) {
			const subscriptionProducts = Array.isArray(data?.products)
				? data.products.filter((p) => p.category === "Subscription")
				: [];
			setProduct(subscriptionProducts);
		}
	}, [data]);

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			<Banner title={props.title} />
			
			{/* Hero Section */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
				<div className="text-center mb-12 sm:mb-16">
					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
						Subscription <span className="text-green-700">Plans</span>
					</h1>
					<p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						Never run out of your favorite coffee. Choose a subscription plan that fits your lifestyle 
						and enjoy fresh coffee delivered to your doorstep on your schedule.
					</p>
				</div>

				{/* Benefits Section */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 sm:mb-16">
					<div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
						<div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
							<FaCoffee className="text-2xl text-green-700" />
						</div>
						<h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Fresh Coffee</h3>
						<p className="text-gray-600 text-center text-sm">
							Get freshly roasted beans delivered to your door
						</p>
					</div>

					<div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
						<div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
							<FaCalendarAlt className="text-2xl text-green-700" />
						</div>
						<h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Flexible Schedule</h3>
						<p className="text-gray-600 text-center text-sm">
							Choose your delivery frequency and pause anytime
						</p>
					</div>

					<div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
						<div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
							<FaGift className="text-2xl text-green-700" />
						</div>
						<h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Exclusive Offers</h3>
						<p className="text-gray-600 text-center text-sm">
							Enjoy special discounts and member-only benefits
						</p>
					</div>

					<div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
						<div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
							<FaSyncAlt className="text-2xl text-green-700" />
						</div>
						<h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Easy Management</h3>
						<p className="text-gray-600 text-center text-sm">
							Modify or cancel your subscription anytime
						</p>
					</div>
				</div>
			</div>

			{/* Products Section */}
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-20">
					<FaSpinner className="text-5xl text-green-700 animate-spin mb-4" />
					<h2 className="text-2xl font-semibold text-gray-700">Loading Subscriptions...</h2>
					<p className="text-gray-500 mt-2">Please wait while we fetch the best plans for you</p>
				</div>
			) : error ? (
				<div className="max-w-2xl mx-auto px-4 py-12">
					<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
						<FaTimes className="text-4xl text-red-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-red-800 mb-2">Oops! Something went wrong</h2>
						<p className="text-red-600">
							{typeof error === 'string' 
								? error 
								: error?.data?.message || error?.error || "Unable to load subscriptions. Please try again later."}
						</p>
					</div>
				</div>
			) : (
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
					{product.length > 0 ? (
						<>
							<div className="mb-8 flex items-center justify-between">
								<h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
									Available <span className="text-green-700">Plans</span>
									<span className="text-green-700 ml-2">({product.length})</span>
								</h2>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 m-4 sm:m-6 md:m-10">
								{product.map((p) => (
									<ProductCard product={p} key={p.id ?? p._id} />
								))}
							</div>
						</>
					) : (
						<div className="max-w-2xl mx-auto px-4 py-20 text-center">
							<div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
								<FaCoffee className="text-5xl text-gray-400 mx-auto mb-4" />
								<h2 className="text-3xl font-bold text-gray-800 mb-4">No Subscription Plans Available</h2>
								<p className="text-lg text-gray-600 mb-8">
									We're currently working on adding exciting subscription plans. Check back soon for updates!
								</p>
								<Link 
									to="/shop"
									className="inline-block px-8 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
								>
									Browse Our Products
								</Link>
							</div>
						</div>
					)}
				</div>
			)}

			{/* CTA Section */}
			{product.length > 0 && (
				<div className="bg-gradient-to-r from-green-700 to-green-800 rounded-2xl mx-4 sm:mx-6 lg:mx-8 mb-12 sm:mb-16 p-8 sm:p-12 text-center text-white shadow-2xl">
					<h2 className="text-3xl sm:text-4xl font-bold mb-4">
						Ready to Start Your Coffee Journey?
					</h2>
					<p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90">
						Join thousands of coffee lovers who never run out of their favorite brew. 
						Subscribe today and enjoy the convenience of regular deliveries.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<div className="flex items-center gap-2 text-green-100">
							<FaCheckCircle className="text-xl" />
							<span className="text-sm sm:text-base">Cancel anytime</span>
						</div>
						<div className="flex items-center gap-2 text-green-100">
							<FaCheckCircle className="text-xl" />
							<span className="text-sm sm:text-base">Free shipping</span>
						</div>
						<div className="flex items-center gap-2 text-green-100">
							<FaCheckCircle className="text-xl" />
							<span className="text-sm sm:text-base">Flexible schedule</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SubscriptionPage;
