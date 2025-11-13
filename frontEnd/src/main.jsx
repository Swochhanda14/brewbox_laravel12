import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import store from './store.js'
import './index.css'
import App from './App.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import HomePage from './pages/HomePage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import SubscriptionPage from './pages/SubscriptionPage.jsx'
import AboutUsPage from './pages/AboutUsPage.jsx'
import ContactUsPage from './pages/ContactUsPage.jsx'
import CartPage from './pages/CartPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ShippingPage from './pages/ShippingPage.jsx'
import PaymentPage from './pages/PaymentPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import AdminProductList from './pages/admin/AdminProductList.jsx'
import AdminUpdateProduct from './pages/admin/AdminUpdateProduct.jsx'
import AdminAddProduct from './pages/admin/AdminAddProduct.jsx'
import PlaceOrderScreen from './pages/PlaceOrderScreen.jsx'
import EsewaSuccessPage from './pages/EsewaSuccessPage.jsx'
import OrderPage from './pages/OrderPage.jsx'
import AdminOrderList from './pages/admin/AdminOrderList.jsx'
import AdminSubscriptionList from './pages/admin/AdminSubscriptionList.jsx'
import AdminUserList from './pages/admin/AdminUserList.jsx'
import AdminUpdateUser from './pages/admin/AdminUpdateUser.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Customer routes with App layout */}
      <Route path='/' element={<App />}>
        <Route index={true} path='/' element={<HomePage />} />
        <Route path='/shop' element={<ShopPage title="shop" />} />
        <Route path='/search/:keyword' element={<ShopPage title="shop" />} />
        <Route path='/page/:pageNumber' element={<ShopPage title="shop" />} />
        <Route path='/search/:keyword/page/:pageNumber' element={<ShopPage title="shop" />} />
        <Route path='/subscription' element={<SubscriptionPage title="subscription" />} />
        <Route path='/subscription/page/:pageNumber' element={<SubscriptionPage title="subscription" />} />
        <Route path='/about-us' element={<AboutUsPage title="about us" />} />
        <Route path='/contact-us' element={<ContactUsPage title="contact us" />} />
        <Route path='/cart' element={<CartPage title="Your Cart" />} />
        <Route path='/login' element={<LoginPage title="Login" />} />
        <Route path='/register' element={<RegisterPage title="Sign Up" />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/product/:id' element={<ProductDetails />} />
        
        <Route path='' element={<PrivateRoute />}>
          <Route path='/shipping' element={<ShippingPage title="Shipping" />} />
          <Route path='/payment' element={<PaymentPage title="Payment" />} />
          <Route path='/placeorder' element={<PlaceOrderScreen title="Place Order" />} />
          <Route path='/payment_success' element={<EsewaSuccessPage title="Place Order" />} />
          <Route path='/order/:id' element={<OrderPage />} />
          <Route path='/profile' element={<ProfilePage title="Profile" />} />
        </Route>
      </Route>

      {/* Admin routes with AdminLayout, outside App */}
      <Route path='' element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/productlist' element={<AdminProductList />} />
          <Route path='/admin/orderlist' element={<AdminOrderList />} />
          <Route path='/admin/subscriptionlist' element={<AdminSubscriptionList />} />
          <Route path='/admin/userlist' element={<AdminUserList />} />
          <Route path='/admin/user/:id/edit' element={<AdminUpdateUser />} />
          <Route path='/admin/productlist/:pageNumber' element={<AdminProductList />} />
          <Route path='/admin/product/create' element={<AdminAddProduct />} />
          <Route path='/admin/product/:id/edit' element={<AdminUpdateProduct />} />
          <Route path='/admin/order/:id' element={<OrderPage />} />
        </Route>
      </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </HelmetProvider>
  </StrictMode>
)