import React, { useState, useEffect } from "react"; // Fixed React import
import { useNavigate, Link } from "react-router-dom"; // ✅ Added Link
import { CiShoppingCart, CiUser, CiSearch, CiMenuBurger } from "react-icons/ci";
// import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import SearchBox from "./SearchBox.jsx";
import api from "../services/api";
import { toast } from "react-toastify";

const Navbar = () => {
  const [active, setActive] = useState("home");
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileUserDropdown, setShowMobileUserDropdown] = useState(false);
  const [firstname, setFirstName] = useState();
  const { cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      const name = userInfo.name.split(" ");
      setFirstName(name[0]);
    }
  }, [userInfo]);


 const handleLogout = async (e) => {
  console.log('🔴 Step 1: Logout button clicked');
  console.log('🔴 Event:', e);
  
  e.preventDefault();
  e.stopPropagation();
  
  console.log('🔴 Step 2: Prevented default');
  
  // Close dropdowns
  // setShowUserDropdown(false);
  setShowMobileUserDropdown(false);
  setMobileMenuOpen(false);
  
  console.log('🔴 Step 3: Closed dropdowns');
  console.log('🔴 Current token:', localStorage.getItem('token'));
  console.log('🔴 Current userInfo:', localStorage.getItem('userInfo'));

  try {
    console.log('🟡 Step 4: Calling logout API...');
    
    const response = await api.post('/api/users/logout');
    
    console.log('🟢 Step 5: API Response:', response.data);
    
    dispatch(logout());
    
    console.log('🟢 Step 6: Dispatched logout');
    console.log('🟢 Token after logout:', localStorage.getItem('token'));
    console.log('🟢 UserInfo after logout:', localStorage.getItem('userInfo'));
    
    navigate('/');
    
    console.log('🟢 Step 7: Navigated to home');
    
    toast.success('Logged out successfully');
  } catch (error) {
    console.error('🔴 Step ERROR:', error);
    console.error('🔴 Error details:', error.response?.data);
    
    dispatch(logout());
    navigate('/');
    toast.info('Logged out locally');
  }
};

  return (
    <>
      <div className="w-full h-auto shadow-md flex items-center justify-between px-2 sm:px-4 md:px-25">
        <Link to="/">
          <img
            src="/logo.png"
            alt="logo"
            className="w-24 sm:w-28 md:w-32 ml-2 sm:ml-4"
          />
        </Link>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-3xl mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <CiMenuBurger />
        </button>
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 lg:gap-10">
          <Link
            to="/"
            onClick={() => {
              setActive("home");
              setShowSearch(false);
            }}
          >
            <li
              className={`${
                active === "home"
                  ? "underline underline-offset-4 font-bold text-green-900"
                  : ""
              }`}
            >
              HOME
            </li>
          </Link>
          <Link
            to="/shop"
            onClick={() => {
              setActive("shop");
              setShowSearch(false);
            }}
          >
            <li
              className={`${
                active === "shop"
                  ? "underline underline-offset-4 font-bold text-green-900"
                  : ""
              }`}
            >
              SHOP
            </li>
          </Link>
          <Link
            to="/subscription"
            onClick={() => {
              setActive("subscription");
              setShowSearch(false);
            }}
          >
            <li
              className={`${
                active === "subscription"
                  ? "underline underline-offset-4 font-bold text-green-900"
                  : ""
              }`}
            >
              SUBSCRIPTION
            </li>
          </Link>
          <Link
            to="/about-us"
            onClick={() => {
              setActive("about");
              setShowSearch(false);
            }}
          >
            <li
              className={`${
                active === "about"
                  ? "underline underline-offset-4 font-bold text-green-900"
                  : ""
              }`}
            >
              ABOUT US
            </li>
          </Link>
          <Link
            to="/contact-us"
            onClick={() => {
              setActive("contact");
              setShowSearch(false);
            }}
          >
            <li
              className={`${
                active === "contact"
                  ? "underline underline-offset-4 font-bold text-green-900"
                  : ""
              }`}
            >
              CONTACT US
            </li>
          </Link>
        </ul>
        {/* Desktop Icons */}
        <div className="hidden md:flex gap-6 text-2xl lg:text-3xl mr-2 sm:mr-4">
          {/* Search Icon */}
          <CiSearch
            className="cursor-pointer"
            onClick={() => setShowSearch((prev) => !prev)}
            title="Search"
          />
          {/* User Dropdown */}
          {userInfo ? (
            <div className="group relative inline-block">
              <CiUser className="cursor-pointer" />
              <div className="absolute top-5 right-0 mt-2 hidden w-40 rounded-md bg-white shadow-lg group-hover:block z-50">
                <ul className="py-1 text-lg text-gray-700">
                  <p className="block px-4 py-2">Hello, {firstname}</p>
                  {userInfo.isAdmin ? (
                    <>
                      <li>
                        <Link
                          to="/admin/orderlist"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setActive("")}
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/subscriptionlist"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setActive("")}
                        >
                          Subscription
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/productlist"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setActive("")}
                        >
                          Products
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/userlist"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setActive("")}
                        >
                          Users
                        </Link>
                      </li>
                    </>
                  ) : (
                    <></>
                  )}
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setActive("")}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="group relative inline-block">
              <CiUser className="cursor-pointer" />
              <div className="absolute top-5 right-0 mt-2 hidden w-40 rounded-md bg-white shadow-lg group-hover:block z-50">
                <ul className="py-1 text-lg text-gray-700">
                  <li>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setActive("")}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setActive("")}
                    >
                      Register
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
          <Link to="/cart" onClick={() => setActive("")} className="relative">
            <CiShoppingCart />
            {cartItems.length > 0 && (
              <span className="absolute top-[-8px] right-[-8px] bg-red-600 text-white text-sm px-2 rounded-full">
                {cartItems.reduce((a, c) => a + c.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md z-50 md:hidden animate-fade-in">
            <ul className="flex flex-col gap-4 p-4">
              <Link
                to="/"
                onClick={() => {
                  setActive("home");
                  setMobileMenuOpen(false);
                  setShowMobileUserDropdown(false);
                  setShowSearch(false);
                }}
              >
                <li
                  className={`${
                    active === "home"
                      ? "underline underline-offset-4 font-bold text-green-900"
                      : ""
                  }`}
                >
                  HOME
                </li>
              </Link>
              <Link
                to="/shop"
                onClick={() => {
                  setActive("shop");
                  setMobileMenuOpen(false);
                  setShowMobileUserDropdown(false);
                  setShowSearch(false);
                }}
              >
                <li
                  className={`${
                    active === "shop"
                      ? "underline underline-offset-4 font-bold text-green-900"
                      : ""
                  }`}
                >
                  SHOP
                </li>
              </Link>
              <Link
                to="/subscription"
                onClick={() => {
                  setActive("subscription");
                  setMobileMenuOpen(false);
                  setShowMobileUserDropdown(false);
                  setShowSearch(false);
                }}
              >
                <li
                  className={`${
                    active === "subscription"
                      ? "underline underline-offset-4 font-bold text-green-900"
                      : ""
                  }`}
                >
                  SUBSCRIPTION
                </li>
              </Link>
              <Link
                to="/about-us"
                onClick={() => {
                  setActive("about");
                  setMobileMenuOpen(false);
                  setShowMobileUserDropdown(false);
                  setShowSearch(false);
                }}
              >
                <li
                  className={`${
                    active === "about"
                      ? "underline underline-offset-4 font-bold text-green-900"
                      : ""
                  }`}
                >
                  ABOUT US
                </li>
              </Link>
              <Link
                to="/contact-us"
                onClick={() => {
                  setActive("contact");
                  setMobileMenuOpen(false);
                  setShowMobileUserDropdown(false);
                  setShowSearch(false);
                }}
              >
                <li
                  className={`${
                    active === "contact"
                      ? "underline underline-offset-4 font-bold text-green-900"
                      : ""
                  }`}
                >
                  CONTACT US
                </li>
              </Link>
              <li className="flex gap-4 items-center mt-2">
                <CiSearch
                  className="cursor-pointer text-2xl"
                  onClick={() => {
                    setShowSearch((prev) => !prev);
                    setMobileMenuOpen(false);
                    setShowMobileUserDropdown(false);
                  }}
                  title="Search"
                />
                <Link
                  to="/cart"
                  onClick={() => {
                    setActive("");
                    setMobileMenuOpen(false);
                    setShowMobileUserDropdown(false);
                    setShowSearch(false);
                  }}
                  className="relative"
                >
                  <CiShoppingCart className="text-2xl" />
                  {cartItems.length > 0 && (
                    <span className="absolute top-[-8px] right-[-8px] bg-red-600 text-white text-xs px-1 rounded-full">
                      {cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <CiUser
                    className="cursor-pointer text-2xl"
                    onClick={() => setShowMobileUserDropdown((prev) => !prev)}
                  />
                  {showMobileUserDropdown && (
                    <div className="absolute left-0 mt-2 w-40 rounded-md bg-white shadow-lg z-50">
                      <ul className="py-1 text-base text-gray-700">
                        {userInfo ? (
                          <>
                            <p className="block px-4 py-2">
                              Hello, {firstname}
                            </p>
                            {userInfo.isAdmin && (
                              <>
                                <li>
                                  <Link
                                    to="/admin/orderlist"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => {
                                      setActive("");
                                      setShowMobileUserDropdown(false);
                                    }}
                                  >
                                    Orders
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="/admin/subscriptionlist"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => {
                                      setActive("");
                                      setShowMobileUserDropdown(false);
                                    }}
                                  >
                                    Subscription
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="/admin/productlist"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => {
                                      setActive("");
                                      setShowMobileUserDropdown(false);
                                    }}
                                  >
                                    Products
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    to="/admin/userlist"
                                    className="block px-4 py-2 hover:bg-gray-100"
                                    onClick={() => {
                                      setActive("");
                                      setShowMobileUserDropdown(false);
                                    }}
                                  >
                                    Users
                                  </Link>
                                </li>
                              </>
                            )}
                            <li>
                              <Link
                                to="/profile"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => {
                                  setActive("");
                                  setShowMobileUserDropdown(false);
                                }}
                              >
                                Profile
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="#"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleLogout();
                                  setShowMobileUserDropdown(false);
                                }}
                              >
                                Logout
                              </Link>
                            </li>
                          </>
                        ) : (
                          <>
                            <li>
                              <Link
                                to="/login"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => {
                                  setActive("");
                                  setShowMobileUserDropdown(false);
                                }}
                              >
                                Login
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/register"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => {
                                  setActive("");
                                  setShowMobileUserDropdown(false);
                                }}
                              >
                                Register
                              </Link>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
      {showSearch && (
        <div className="w-full flex justify-center p-4 bg-gray-100 shadow-md">
          <div className="max-w-2xl">
            <SearchBox />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
