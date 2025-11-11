import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// import Message from '../components/Message';
// import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from '../slices/ordersApiSlice';
import { BASE_URL } from '../constants';

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
  const { userInfo } = useSelector((state) => state.auth);
  // console.log(userInfo)

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
    toast.success('Order marked as delivered');
  };

  return isLoading ? (
    <>Loading...</>
  ) : error ? (
    <>{error.data.message}</>
  ) : (
    <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Order {order.id ?? order._id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Section */}
        <div className="md:col-span-2 space-y-4 sm:space-y-6">
          {/* Shipping Info */}
          <div className="p-3 sm:p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Shipping</h2>
            <p>
              <span className="font-medium">Name:</span> {order.user?.name}
            </p>
            <p>
              <span className="font-medium">Contact:</span> {order.user?.number}
            </p>
            <p>
              <span className="font-medium">Email:</span>{' '}
              <a href={`mailto:${order.user?.email}`} className="text-blue-600 underline">
                {order.user?.email}
              </a>
            </p>
            <p>
              <span className="font-medium">Address:</span>{' '}
              {(() => {
                const shipping = order.shippingAddress ?? order.shipping_address ?? {};
                return `${shipping.address ?? ''}${shipping.city ? ', ' + shipping.city : ''}`;
              })()}
            </p>
            {(order.is_delivered ?? order.isDelivered) ? (
              <div className= 'mt-3 sm:mt-5 p-3 sm:p-5 rounded bg-green-200 text-green-900'>Delivered on {order.delivered_at ?? order.deliveredAt}</div>
            ) : (
              <div className= 'mt-3 sm:mt-5 p-3 sm:p-5 rounded bg-red-200 text-red-900'>Not Delivered</div>
            )}
          </div>

          {/* Payment Method */}
          <div className="p-3 sm:p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Payment Method</h2>
            <p className='flex gap-2'>
              <span className="font-medium ">Method:</span><span className='uppercase'>{order.paymentMethod ?? order.payment_method}</span>
            </p>
            
          </div>

          {/* Order Items */}
          <div className="p-3 sm:p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Order Items</h2>
            {(order.orderItems ?? order.order_items)?.length === 0 ? (
              <>Order is empty</>
            ) : (
              <ul className="space-y-3 sm:space-y-4">
                {(order.orderItems ?? order.order_items).map((item, index) => (
                  <li key={index} className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                    <div className='flex items-center gap-2'>
                      <img
                        src={`${BASE_URL}${item.image}`}
                        alt={item.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                      />
                      <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <Link to={`/product/${(item.product?.id ?? item.product?._id ?? item.product)}`} className="text-blue-600 underline text-base sm:text-lg truncate max-w-[120px] sm:max-w-xs">
                          {item.name}
                        </Link>
                        <div className="text-xs sm:text-lg text-gray-600 capitalize ml-0 sm:ml-2">
                          {item.product?.category === 'Subscription' && (
                            <span className="mr-2 text-green-600">Roast: {item.roast}</span>
                          )}
                          (Size: {item.size}, Grind: {item.grind})
                        </div>
                      </div>
                    </div>
                    <div className="text-xs sm:text-lg mt-1 sm:mt-0">
                      {item.qty} x Rs.{item.price} = Rs.{(item.qty * item.price).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Section - Order Summary */}
        <div className="p-3 sm:p-4 border rounded-lg shadow-sm bg-white space-y-3 sm:space-y-4 mt-6 md:mt-0">
          <h2 className="text-lg sm:text-xl font-semibold">Order Summary</h2>
          <div className="flex justify-between text-xs sm:text-base">
            <span>Items</span>
            <span>Rs.{order.items_price ?? order.itemsPrice}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-base">
            <span>Shipping</span>
            <span>Rs.{order.shipping_price ?? order.shippingPrice}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-base">
            <span>Tax</span>
            <span>Rs.{order.tax_price ?? order.taxPrice}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 text-base sm:text-lg">
            <span>Total</span>
            <span>Rs.{order.total_price ?? order.totalPrice}</span>
          </div>

          {/* Admin: Mark as Delivered */}
          {loadingDeliver && <>Loading...</>}
          {userInfo && userInfo.isAdmin && !(order.is_delivered ?? order.isDelivered) && (
            <button
              onClick={deliverHandler}
              className="w-full mt-3 sm:mt-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Mark As Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
