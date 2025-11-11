import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EsewaSuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();
  const hasOrderedRef = useRef(false); // 🔒 prevent duplicate order

  useEffect(() => {
    const placeOrderAfterEsewa = async () => {
      if (hasOrderedRef.current) return;
      hasOrderedRef.current = true;

      try {
        const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
        const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress") || "{}");
        const paymentMethod = localStorage.getItem("paymentMethod") || "Esewa";
        const itemsPrice = Number(localStorage.getItem("itemsPrice") || "0");
        const shippingPrice = Number(localStorage.getItem("shippingPrice") || "0");
        const taxPrice = Number(localStorage.getItem("taxPrice") || "0");
        const totalPrice = Number(localStorage.getItem("totalPrice") || "0");

        if (!cartItems.length) {
          toast.error("No cart items found.");
          navigate("/");
          return;
        }

        const res = await createOrder({
          orderItems: cartItems.map((item) => ({
            name: item.product_name,
            qty: item.quantity,
            image: item.image[0],
            price: item.price,
            product: item._id,
            size: item.size, // Pass size from client
            grind: item.grind, // Pass grind from client
            roast: item.roast, // Pass roast from client
          })),
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        }).unwrap();

        dispatch(clearCartItems());

        // Clean up localStorage
        localStorage.removeItem("cartItems");
        localStorage.removeItem("shippingAddress");
        localStorage.removeItem("paymentMethod");
        localStorage.removeItem("itemsPrice");
        localStorage.removeItem("shippingPrice");
        localStorage.removeItem("taxPrice");
        localStorage.removeItem("totalPrice");

        navigate(`/order/${res.id ?? res._id}`);
      } catch (err) {
        toast.error(err?.data?.message || "Order creation failed after payment.");
        navigate("/");
      }
    };

    placeOrderAfterEsewa();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-xl font-bold mb-4">Processing your order...</h2>
      <p>Please wait while we confirm your payment and place your order.</p>
    </div>
  );
};

export default EsewaSuccessPage;
