import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useCancelOrderMutation,
} from '../slices/ordersApiSlice';
import { BASE_URL } from '../constants';
import { FaSpinner, FaCheckCircle, FaTimes, FaTruck, FaCreditCard, FaShoppingBag, FaMapMarkerAlt, FaEnvelope, FaPhone, FaUser, FaBan } from 'react-icons/fa';

const OrderPage = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  console.log(order)

  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [cancelOrder, { isLoading: loadingCancel }] = useCancelOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  
  const isAdmin = userInfo?.isAdmin;
  const isOwner = order?.user_id === userInfo?._id || order?.user?.id === userInfo?._id;
  const canCancel = isOwner && !(order?.is_delivered ?? order?.isDelivered) && order?.status !== 'cancelled';

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success('Order marked as delivered');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to mark order as delivered');
    }
  };

  const cancelHandler = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    try {
      await cancelOrder(orderId).unwrap();
      refetch();
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to cancel order');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FaSpinner className="text-5xl text-green-700 animate-spin mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">Loading Order Details...</h2>
        </div>
      ) : error ? (
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <FaTimes className="text-4xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Order</h2>
            <p className="text-red-600">{error.data?.message || error.error || "Unable to load order details"}</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Order <span className="text-green-700">#{order.id ?? order._id}</span>
            </h1>
            <p className="text-gray-600">
              Order placed on {(order.created_at ?? order.createdAt) ? (order.created_at ?? order.createdAt).substring(0, 10) : 'N/A'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Info */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FaTruck className="text-xl text-green-700" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Shipping Information</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-green-700" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-semibold text-gray-800">{order.user?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-green-700" />
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-semibold text-gray-800">{order.user?.number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-green-700" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <a href={`mailto:${order.user?.email}`} className="font-semibold text-green-700 hover:text-green-800 transition-colors">
                        {order.user?.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-green-700 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-semibold text-gray-800">
                        {(() => {
                          const shipping = order.shippingAddress ?? order.shipping_address ?? {};
                          return `${shipping.address ?? ''}${shipping.city ? ', ' + shipping.city : ''}`;
                        })()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    {(order.is_delivered ?? order.isDelivered) ? (
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                        <FaCheckCircle className="text-2xl text-green-700" />
                        <div>
                          <p className="font-semibold text-green-800">Delivered</p>
                          <p className="text-sm text-green-700">
                            {order.delivered_at ?? order.deliveredAt ? `Delivered on ${(order.delivered_at ?? order.deliveredAt).substring(0, 10)}` : 'Order has been delivered'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                        <FaTimes className="text-2xl text-yellow-700" />
                        <div>
                          <p className="font-semibold text-yellow-800">Not Delivered</p>
                          <p className="text-sm text-yellow-700">Your order is being processed</p>
                        </div>
                      </div>
                    )}
                  </div>
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
                    {order.paymentMethod ?? order.payment_method}
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
                {(order.orderItems ?? order.order_items)?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Order is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(order.orderItems ?? order.order_items).map((item, index) => {
                      // Debug: Check what values we're receiving
                      console.log('Order item:', {
                        name: item.name,
                        size: item.size,
                        grind: item.grind,
                        sizeType: typeof item.size,
                        grindType: typeof item.grind,
                      });
                      return (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <Link to={`/product/${(item.product?.id ?? item.product?._id ?? item.product)}`} className="flex-shrink-0">
                          <img
                            src={`${BASE_URL}${item.image}`}
                            alt={item.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link 
                            to={`/product/${(item.product?.id ?? item.product?._id ?? item.product)}`}
                            className="text-base sm:text-lg font-semibold text-gray-800 hover:text-green-700 transition-colors block mb-1"
                          >
                            {item.name}
                          </Link>
                          <div className="text-sm text-gray-600 space-y-1">
                            {item.product?.category === 'Subscription' && item.roast && (
                              <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold mr-2">
                                Roast: {item.roast}
                              </span>
                            )}
                            <span className="capitalize">
                              {(() => {
                                // Get and validate size
                                const size = item.size ? String(item.size).trim() : '';
                                const hasSize = size !== '' && size !== 'N/A' && size !== 'null' && size !== 'undefined';
                                
                                // Get and validate grind
                                const grind = item.grind ? String(item.grind).trim() : '';
                                const hasGrind = grind !== '' && grind !== 'N/A' && grind !== 'null' && grind !== 'undefined';
                                
                                // Build display string only if we have valid values
                                if (hasSize && hasGrind) {
                                  return `Size: ${size}, Grind: ${grind}`;
                                } else if (hasSize) {
                                  return `Size: ${size}`;
                                } else if (hasGrind) {
                                  return `Grind: ${grind}`;
                                } else {
                                  return 'No customization';
                                }
                              })()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">
                            {item.qty} x Rs.{item.price}
                          </p>
                          <p className="text-lg font-bold text-green-700">
                            Rs.{(item.qty * item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Items</span>
                    <span className="font-semibold text-gray-800">Rs.{order.items_price ?? order.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-800">Rs.{order.shipping_price ?? order.shippingPrice}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold text-gray-800">Rs.{order.tax_price ?? order.taxPrice}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-bold text-green-700 text-xl">Rs.{order.total_price ?? order.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Cancel Order Button (User) */}
                {canCancel && (
                  <>
                    {loadingCancel && (
                      <div className="flex items-center justify-center gap-2 text-red-700 mb-4">
                        <FaSpinner className="animate-spin" />
                        <span>Cancelling...</span>
                      </div>
                    )}
                    <button
                      onClick={cancelHandler}
                      disabled={loadingCancel}
                      className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-3 flex items-center justify-center gap-2"
                    >
                      <FaBan />
                      Cancel Order
                    </button>
                  </>
                )}

                {/* Order Status */}
                {order?.status === 'cancelled' && (
                  <div className="w-full py-3 px-6 bg-red-50 border border-red-200 text-red-800 font-semibold rounded-lg text-center mb-3">
                    Order Cancelled
                  </div>
                )}

                {/* Admin: Mark as Delivered */}
                {loadingDeliver && (
                  <div className="flex items-center justify-center gap-2 text-green-700 mb-4">
                    <FaSpinner className="animate-spin" />
                    <span>Updating...</span>
                  </div>
                )}
                {userInfo && userInfo.isAdmin && !(order.is_delivered ?? order.isDelivered) && order?.status !== 'cancelled' && (
                  <button
                    onClick={deliverHandler}
                    disabled={loadingDeliver}
                    className="w-full py-3 px-6 bg-gradient-to-r from-green-700 to-green-800 text-white font-semibold rounded-lg hover:from-green-800 hover:to-green-900 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Mark As Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
