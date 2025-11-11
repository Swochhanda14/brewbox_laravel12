import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'Esewa' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // NOTE: we don't need user, rating, numReviews or reviews
      // in the cart
      const { user, rating, numReviews, reviews, ...item } = action.payload;
      // Normalize ids and fields from backend/frontend variants
      const normalizedId = item._id ?? item.id;
      const normalizedCountInStock = item.countInStock ?? item.count_in_stock ?? item.count_inStock;
      const normalizedImage = Array.isArray(item.image) ? item.image : (item.image ? [item.image] : []);
      const normalizedItem = {
        ...item,
        _id: normalizedId,
        countInStock: normalizedCountInStock,
        image: normalizedImage,
      };

      const existItem = state.cartItems.find((x) => x._id === normalizedItem._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? normalizedItem : x
        );
      } else {
        state.cartItems = [...state.cartItems, normalizedItem];
      }

      return updateCart(state, normalizedItem);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== (action.payload?._id ?? action.payload?.id ?? action.payload));
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    // NOTE: here we need to reset state for when a user logs out so the next
    // user doesn't inherit the previous users cart and shipping
    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
