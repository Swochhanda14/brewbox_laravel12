import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from 'uuid';
import { BASE_URL } from '../constants';
import { FaTruck, FaCreditCard, FaShoppingBag, FaSpinner, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [esewaFormSubmitted, setEsewaFormSubmitted] = useState(false);
  const esewaFormRef = useRef(null);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  // Calculate amounts
  const itemsPrice = cart.itemsPrice;
  const taxPrice = cart.taxPrice;
  const totalPrice = cart.totalPrice;
  // const totalAmount = itemsPrice+taxPrice;
  // console.log(totalPrice, itemsPrice, taxPrice);

  const placeOrderHandler = async () => {
    if (cart.paymentMethod === 'Esewa') {
  const uid = uuidv4();
  const itemsPriceNum = Number(itemsPrice);
  const taxPriceNum = Number(taxPrice);
  const shippingPriceNum = Number(cart.shippingPrice);
  const serviceChargeNum = 0;
  const totalAmountNum = itemsPriceNum + taxPriceNum + serviceChargeNum + shippingPriceNum;

  const itemsPriceStr = itemsPriceNum.toFixed(2);
  const taxPriceStr = taxPriceNum.toFixed(2);
  const shippingPriceStr = shippingPriceNum.toFixed(2);
  const serviceChargeStr = serviceChargeNum.toFixed(2);
  const totalAmountStr = totalAmountNum.toFixed(2);

  // eSewa signature must match signed_field_names order exactly.
  // Sandbox commonly expects only these three fields to be signed.
  const message = [
    `total_amount=${totalAmountStr}`,
    `transaction_uuid=${uid}`,
    `product_code=EPAYTEST`,
  ].join(',');
  const esewaSecret = import.meta.env.VITE_ESEWASECRET;
  if (!esewaSecret) {
    toast.error('eSewa secret not configured');
    return;
  }
  const hash = CryptoJS.HmacSHA256(message, esewaSecret);
  const signature = CryptoJS.enc.Base64.stringify(hash);

  // 🔐 Save to localStorage for recovery after redirect
  localStorage.setItem("cartItems", JSON.stringify(cart.cartItems));
  localStorage.setItem("shippingAddress", JSON.stringify(cart.shippingAddress));
  localStorage.setItem("paymentMethod", cart.paymentMethod);
  localStorage.setItem("itemsPrice", itemsPrice);
  localStorage.setItem("shippingPrice", cart.shippingPrice);
  localStorage.setItem("taxPrice", taxPrice);
  localStorage.setItem("totalPrice", totalPrice);

  if (esewaFormRef.current) {
    const form = esewaFormRef.current;
    form.amount.value = itemsPriceStr;
    form.tax_amount.value = taxPriceStr;
    form.total_amount.value = totalAmountStr;
    form.product_service_charge.value = serviceChargeStr;
    form.product_delivery_charge.value = shippingPriceStr;
    form.transaction_uuid.value = uid;
    // signed fields MUST match message fields and order
    form.signed_field_names.value = 'total_amount,transaction_uuid,product_code';
    form.signature.value = signature;

    setEsewaFormSubmitted(true);
    form.submit();
  } else {
    toast.error('Payment form not ready. Please try again.');
  }
  return;
}


    // Normal order process
    try {
      const res = await createOrder({
        orderItems: cart.cartItems.map(item => ({
          name: item.product_name,
          qty: item.quantity,
          size: item.size,
          grind: item.grind,
          roast: item.roast,
          image: item.image[0],
          price: item.price,
          product: item._id,
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: Number(itemsPrice),
        shippingPrice: Number(cart.shippingPrice),
        taxPrice: Number(taxPrice),
        totalPrice: Number(totalPrice),
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res.id ?? res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Order failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <CheckoutSteps step1 step2 step3 step4 />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaTruck className="text-xl text-green-700" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Shipping Address</h2>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-green-700 mt-1" />
                <p className="text-base sm:text-lg text-gray-800">
                  <span className="font-semibold">{cart.shippingAddress.address}</span>, {cart.shippingAddress.city}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCreditCard className="text-xl text-green-700" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Payment Method</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-lg uppercase">
                  {cart.paymentMethod}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FaShoppingBag className="text-xl text-green-700" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Order Items</h2>
              </div>
              {cart.cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Link to={`/product/${item.product}`} className="flex-shrink-0">
                        <img
                          src={`${BASE_URL}${item.image[0]}`}
                          alt={item.product_name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-base sm:text-lg font-semibold text-gray-800 hover:text-green-700 transition-colors block mb-1"
                        >
                          {item.product_name}
                        </Link>
                        <div className="text-sm text-gray-600 space-y-1">
                          {item.category === 'Subscription' && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold mr-2">
                              Roast: {item.roast}
                            </span>
                          )}
                          <span className="capitalize">Size: {item.size}, Grind: {item.grind}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">
                          {item.quantity} x Rs.{item.price}
                        </p>
                        <p className="text-lg font-bold text-green-700">
                          Rs.{(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Items</span>
                  <span className="font-semibold text-gray-800">Rs.{itemsPrice}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-800">Rs.{cart.shippingPrice}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-800">Rs.{taxPrice}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-green-700 text-xl">Rs.{totalPrice}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-semibold">{error?.data?.message || "An error occurred"}</p>
                </div>
              )}

              {/* Esewa Payment Form - Hidden */}
              <form
                ref={esewaFormRef}
                action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
                method="POST"
                style={{ display: 'none' }}
              >
                <input type="hidden" name="amount" />
                <input type="hidden" name="tax_amount" />
                <input type="hidden" name="total_amount" />
                <input type="hidden" name="transaction_uuid" />
                <input type="hidden" name="product_code" value="EPAYTEST" />
                <input type="hidden" name="product_service_charge" value="0" />
                <input type="hidden" name="product_delivery_charge"/>
                <input type="hidden" name="success_url" value="http://localhost:5173/payment_success" />
                <input type="hidden" name="failure_url" value="http://localhost:5173/failure" />
                <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
                <input type="hidden" name="signature" />
              </form>

              <button
                type="button"
                disabled={cart.cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
                className={`w-full py-3 px-6 rounded-lg font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                  cart.cartItems.length === 0 || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : cart.paymentMethod === 'Esewa'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 shadow-lg'
                    : 'bg-gradient-to-r from-green-700 to-green-800 text-white hover:from-green-800 hover:to-green-900 transform hover:scale-105 shadow-lg'
                }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {cart.paymentMethod === 'Esewa' ? 'Pay with Esewa' : 'Place Order'}
                    <FaArrowRight />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
