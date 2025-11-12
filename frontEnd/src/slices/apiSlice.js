import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../constants'
import { logout } from './authSlice' // FIX: Import logout

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state
    const token = getState().auth.userInfo?.token;
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    headers.set('Accept', 'application/json');
    return headers;
  },
});

async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra);
  
  // Dispatch the logout action on 401
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }
  
  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Product', 'Products', 'Order', 'User'],
  endpoints: (builder) => ({}),
});