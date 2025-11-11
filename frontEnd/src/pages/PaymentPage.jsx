import { useState, useEffect } from "react";
import Banner from "../components/Banner";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../slices/cartSlice";

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
		<div>
			<Banner title={props.title} />
			<div className="flex flex-col items-center gap-5 mb-10 px-2 sm:px-0">
				<CheckoutSteps step1 step2 step3 />
				<form
					onSubmit={submitHandler}
					className="p-2 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 flex flex-col gap-6"
				>
					<p className="text-lg sm:text-xl font-semibold text-gray-600">
						Select Payment Method
					</p>

					<div className="flex gap-2 text-base sm:text-xl">
						<input
							className="border rounded p-2 text-base sm:text-lg"
							type="radio"
							id="esewa"
							name="paymentMethod"
							value="Esewa"
							checked={paymentMethod === "Esewa"}
							onChange={(e) => setPaymentMethod(e.target.value)}
						/>
						<label htmlFor="esewa">Esewa</label>
					</div>

					{!hasSubscription && (
						<div className="flex gap-2 text-base sm:text-xl">
							<input
								className="border rounded p-2 text-base sm:text-lg"
								type="radio"
								id="cod"
								name="paymentMethod"
								value="cod"
								checked={paymentMethod === "cod"}
								onChange={(e) => setPaymentMethod(e.target.value)}
							/>
							<label htmlFor="cod">Cash on Delivery</label>
						</div>
					)}

					<button
						type="submit"
						className="py-3 px-7 bg-green-800 text-base sm:text-lg text-white font-semibold rounded hover:bg-green-700 hover:cursor-pointer"
					>
						Continue
					</button>
				</form>
			</div>
		</div>
	);
};

export default PaymentPage;
