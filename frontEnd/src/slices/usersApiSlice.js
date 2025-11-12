import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
      }),
      // // Get CSRF cookie before login
      // async onQueryStarted(arg, { queryFulfilled }) {
      //   try {
      //     // First, get the CSRF cookie
      //     await fetch('http://localhost:8000/sanctum/csrf-cookie', {
      //       credentials: 'include',
      //     });
      //   } catch (error) {
      //     console.error('Failed to get CSRF cookie:', error);
      //   }
      // },
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }],
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => {
        const { userId, ...bodyData } = data;
        return {
          url: `${USERS_URL}/${userId}`,
          method: 'PUT',
          body: bodyData,
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: 'User', id: arg.userId },
        'User',
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} = userApiSlice;
