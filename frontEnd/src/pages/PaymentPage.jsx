import { useState, useEffect } from "react";
import Banner from "../components/Banner";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../slices/cartSlice";
import { FaCreditCard, FaMoneyBillWave, FaArrowRight } from "react-icons/fa";

const PaymentPage = (props) => {
	const cart = useSelector((state) => state.cart);
	const { shippingAddress, cartItems } = cart;

	const [paymentMethod, setPaymentMethod] = useState("Esewa");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Check if any cart item is a subscription
	const hasSubscription =
		cartItems && cartItems.some((item) => item.category === "Subscription");

	useEffect(() => {
		if (!shippingAddress) {
			navigate("/shipping");
		}
	}, [shippingAddress, navigate]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(savePaymentMethod(paymentMethod));
		navigate("/placeorder");
	};
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			<Banner title={props.title} />
			<div className="flex flex-col items-center gap-8 mb-10 px-4 sm:px-0 pb-12">
				<CheckoutSteps step1 step2 step3 />
				<div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3">
					<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10">
						<div className="text-center mb-6">
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
								Payment Method
							</h2>
							<p className="text-gray-600">Choose your preferred payment option</p>
						</div>
						<form onSubmit={submitHandler} className="flex flex-col gap-6">
							<div className="space-y-4">
								<label
									htmlFor="esewa"
									className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
										paymentMethod === "Esewa"
											? "border-green-500 bg-green-50"
											: "border-gray-200 hover:border-green-300 hover:bg-gray-50"
									}`}
								>
									<input
										type="radio"
										id="esewa"
										name="paymentMethod"
										value="Esewa"
										checked={paymentMethod === "Esewa"}
										onChange={(e) => setPaymentMethod(e.target.value)}
										className="w-5 h-5 accent-green-600"
									/>
									<div className="flex items-center gap-3 flex-1">
										<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
											<FaCreditCard className="text-xl text-green-700" />
										</div>
										<div>
											<p className="font-semibold text-gray-800">Esewa</p>
											<p className="text-sm text-gray-600">Pay securely with Esewa</p>
										</div>
									</div>
								</label>

								{!hasSubscription && (
									<label
										htmlFor="cod"
										className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
											paymentMethod === "cod"
												? "border-green-500 bg-green-50"
												: "border-gray-200 hover:border-green-300 hover:bg-gray-50"
										}`}
									>
										<input
											type="radio"
											id="cod"
											name="paymentMethod"
											value="cod"
											checked={paymentMethod === "cod"}
											onChange={(e) => setPaymentMethod(e.target.value)}
											className="w-5 h-5 accent-green-600"
										/>
										<div className="flex items-center gap-3 flex-1">
											<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
												<FaMoneyBillWave className="text-xl text-green-700" />
											</div>
											<div>
												<p className="font-semibold text-gray-800">Cash on Delivery</p>
												<p className="text-sm text-gray-600">Pay when you receive</p>
											</div>
										</div>
									</label>
								)}
							</div>

							<button
								type="submit"
								className="w-full py-3 px-7 bg-gradient-to-r from-green-700 to-green-800 text-base sm:text-lg text-white font-semibold rounded-lg hover:from-green-800 hover:to-green-900 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
							>
								Continue
								<FaArrowRight />
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentPage;
