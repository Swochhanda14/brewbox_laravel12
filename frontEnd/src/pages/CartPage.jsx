import React from 'react'
import Banner from '../components/Banner'
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { FaTrash, FaShoppingCart, FaArrowRight, FaGift } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from '../constants';


const CartPage = (props) => {
  const dispatch = useDispatch();
	const cart = useSelector((state) => state.cart);
	const { cartItems } = cart;
	// console.log(cart.itemsPrice)
  const navigate=useNavigate();

	const addToCartHandler = async (product, qty) => {
		dispatch(addToCart({ ...product, quantity: qty }));
	};

	const removeFromCartHandler = async (id) => {
		dispatch(removeFromCart(id));
	};

	const checkoutHandler = () => {
		navigate("/login?redirect=/shipping");
	};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Banner title={props.title}/>
      <div className='w-full flex justify-center mt-6 sm:mt-10 pb-12'>
        <div className="flex flex-col lg:flex-row gap-6 mt-3 sm:mt-5 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-full lg:w-3/4">
            {/* Subscription Banner */}
            <div className="bg-gradient-to-r from-green-50 via-green-100 to-green-50 border-2 border-green-200 rounded-2xl p-6 sm:p-8 mb-6 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaGift className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">
                      Love your daily brew?
                    </h3>
                    <p className="text-sm sm:text-base text-green-700">
                      Try our subscription coffee plans for fresh beans delivered on your schedule and save on every bag.
                    </p>
                  </div>
                </div>
                <Link
                  to="/subscription"
                  className="inline-flex items-center justify-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
                >
                  Explore Subscriptions
                  <FaArrowRight />
                </Link>
              </div>
            </div>

            {/* Cart Items */}
            {cartItems.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-700 to-green-800 px-6 py-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <FaShoppingCart />
                    Shopping Cart ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left font-bold text-gray-700 p-4 text-sm sm:text-base uppercase tracking-wide">Product</th>
                        <th className="text-left font-bold text-gray-700 p-4 text-sm sm:text-base uppercase tracking-wide">Price</th>
                        <th className="text-left font-bold text-gray-700 p-4 text-sm sm:text-base uppercase tracking-wide">Quantity</th>
                        <th className="text-left font-bold text-gray-700 p-4 text-sm sm:text-base uppercase tracking-wide">Total</th>
                        <th className="text-center font-bold text-gray-700 p-4 text-sm sm:text-base uppercase tracking-wide">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-6 px-4">
                            <Link to={`/product/${item._id}`} className="flex items-center gap-4 group">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow">
                                <img
                                  className="h-full w-full object-cover"
                                  src={`${BASE_URL}${item.image[0]}`}
                                  alt={item.product_name}
                                />
                              </div>
                              <span className="font-semibold text-sm sm:text-base text-gray-800 group-hover:text-green-700 transition-colors">
                                {item.product_name}
                              </span>
                            </Link>
                          </td>
                          <td className="py-6 px-4">
                            <span className="text-sm sm:text-base font-semibold text-gray-700">Rs {item.price}</span>
                          </td>
                          <td className="py-6 px-4">
                            <input
                              type="number"
                              className="border-2 border-gray-300 rounded-lg px-3 py-2 w-20 text-center text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                              min={1}
                              max={item.countInStock}
                              value={item.quantity}
                              onChange={(e) =>
                                addToCartHandler(item, Number(e.target.value))
                              }
                            />
                          </td>
                          <td className="py-6 px-4">
                            <span className="text-sm sm:text-base font-bold text-green-700">Rs {item.price * item.quantity}</span>
                          </td>
                          <td className="py-6 px-4 text-center">
                            <button
                              onClick={() => removeFromCartHandler(item._id)}
                              className="w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 flex items-center justify-center group"
                              aria-label="Remove item"
                            >
                              <FaTrash className="group-hover:scale-110 transition-transform" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 sm:p-16 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaShoppingCart className="text-4xl text-gray-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white font-semibold rounded-lg hover:from-green-800 hover:to-green-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Shopping
                  <FaArrowRight />
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-800">{cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-semibold text-gray-800">{cart.taxPrice}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-800">{cart.shippingPrice}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-green-700 text-xl">{cart.totalPrice}</span>
                  </div>
                </div>
              </div>
              <button
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
                className={`w-full py-3 px-6 rounded-lg font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                  cartItems.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-700 to-green-800 text-white hover:from-green-800 hover:to-green-900 transform hover:scale-105 shadow-lg'
                }`}
              >
                <FaArrowRight />
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
