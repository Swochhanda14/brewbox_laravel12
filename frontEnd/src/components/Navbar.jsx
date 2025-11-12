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
  const [showUserDropdown, setShowUserDropdown] = useState(false);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-dropdown-container')) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);


 const handleLogout = async (e) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  // Close dropdowns immediately
  setShowUserDropdown(false);
  setShowMobileUserDropdown(false);
  setMobileMenuOpen(false);
  
  try {
    // Try to call logout API
    await api.post('/api/users/logout');
  } catch (error) {
    // Even if API call fails, continue with local logout
    console.error('Logout API error:', error);
  }
  
  // Always dispatch logout to clear local state
  dispatch(logout());
  
  // Clear any remaining localStorage items
  localStorage.removeItem('userInfo');
  localStorage.removeItem('token');
  
  // Navigate to home
  navigate('/');
  
  // Show success message
  toast.success('Logged out successfully');
};

  return (
    <>
      <div className="w-full h-auto bg-white shadow-lg border-b border-gray-100 flex items-center justify-between px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 sticky top-0 z-40">
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="logo"
            className="w-24 sm:w-28 md:w-32 ml-2 sm:ml-4 transition-transform duration-300 hover:scale-105"
          />
        </Link>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-3xl mr-2 text-gray-700 hover:text-green-700 transition-colors p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <CiMenuBurger />
        </button>
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-3 lg:gap-6 items-center">
          <Link
            to="/"
            onClick={() => {
              setActive("home");
              setShowSearch(false);
            }}
            className="transition-colors"
          >
            <li
              className={`px-4 py-2.5 rounded-lg transition-all duration-300 text-base lg:text-lg font-medium tracking-wide ${
                active === "home"
                  ? "bg-green-100 text-green-800 font-bold shadow-sm"
                  : "text-gray-800 hover:text-green-700 hover:bg-green-50"
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
            className="transition-colors"
          >
            <li
              className={`px-4 py-2.5 rounded-lg transition-all duration-300 text-base lg:text-lg font-medium tracking-wide ${
                active === "shop"
                  ? "bg-green-100 text-green-800 font-bold shadow-sm"
                  : "text-gray-800 hover:text-green-700 hover:bg-green-50"
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
            className="transition-colors"
          >
            <li
              className={`px-4 py-2.5 rounded-lg transition-all duration-300 text-base lg:text-lg font-medium tracking-wide ${
                active === "subscription"
                  ? "bg-green-100 text-green-800 font-bold shadow-sm"
                  : "text-gray-800 hover:text-green-700 hover:bg-green-50"
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
            className="transition-colors"
          >
            <li
              className={`px-4 py-2.5 rounded-lg transition-all duration-300 text-base lg:text-lg font-medium tracking-wide ${
                active === "about"
                  ? "bg-green-100 text-green-800 font-bold shadow-sm"
                  : "text-gray-800 hover:text-green-700 hover:bg-green-50"
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
            className="transition-colors"
          >
            <li
              className={`px-4 py-2.5 rounded-lg transition-all duration-300 text-base lg:text-lg font-medium tracking-wide ${
                active === "contact"
                  ? "bg-green-100 text-green-800 font-bold shadow-sm"
                  : "text-gray-800 hover:text-green-700 hover:bg-green-50"
              }`}
            >
              CONTACT US
            </li>
          </Link>
        </ul>
        {/* Desktop Icons */}
        <div className="hidden md:flex gap-5 lg:gap-7 text-2xl lg:text-3xl xl:text-4xl mr-2 sm:mr-4 items-center">
          {/* Search Icon */}
          <CiSearch
            className="cursor-pointer text-gray-700 hover:text-green-700 transition-colors duration-300 hover:scale-110"
            onClick={() => setShowSearch((prev) => !prev)}
            title="Search"
          />
          {/* User Dropdown */}
          {userInfo ? (
            <div className="relative inline-block user-dropdown-container">
              <CiUser 
                className="cursor-pointer text-gray-700 hover:text-green-700 transition-colors duration-300 hover:scale-110" 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              />
              {showUserDropdown && (
                <div className="absolute top-8 right-0 mt-2 w-52 rounded-lg bg-white shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 px-5 py-3.5 border-b border-gray-200">
                    <p className="text-base font-bold text-green-800">Hello, {firstname}</p>
                  </div>
                  <ul className="py-2">
                    {userInfo.isAdmin ? (
                      <>
                        <li>
                          <Link
                            to="/admin/orderlist"
                            className="block px-5 py-2.5 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
                            onClick={() => {
                              setActive("");
                              setShowUserDropdown(false);
                            }}
                          >
                            Orders
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/subscriptionlist"
                            className="block px-5 py-2.5 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
                            onClick={() => {
                              setActive("");
                              setShowUserDropdown(false);
                            }}
                          >
                            Subscription
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/productlist"
                            className="block px-5 py-2.5 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
                            onClick={() => {
                              setActive("");
                              setShowUserDropdown(false);
                            }}
                          >
                            Products
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/userlist"
                            className="block px-5 py-2.5 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
                            onClick={() => {
                              setActive("");
                              setShowUserDropdown(false);
                            }}
                          >
                            Users
                          </Link>
                        </li>
                        <li className="border-t border-gray-200 my-1"></li>
                      </>
                    ) : (
                      <></>
                    )}
                    <li>
                      <Link
                        to="/profile"
                        className="block px-5 py-2.5 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
                        onClick={() => {
                          setActive("");
                          setShowUserDropdown(false);
                        }}
                      >
                        Profile
                      </Link>
                    </li>
                    <li className="border-t border-gray-200 my-1"></li>
                    <li>
                      <button
                        type="button"
                        className="w-full text-left block px-5 py-2.5 text-base text-red-600 hover:bg-red-50 transition-colors font-medium"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="relative inline-block user-dropdown-container">
              <CiUser 
                className="cursor-pointer text-gray-700 hover:text-green-700 transition-colors duration-300 hover:scale-110" 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              />
              {showUserDropdown && (
                <div className="absolute top-8 right-0 mt-2 w-44 rounded-lg bg-white shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <ul className="py-2">
                    <li>
                      <Link
                        to="/login"
                        className="block px-5 py-3 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-semibold"
                        onClick={() => {
                          setActive("");
                          setShowUserDropdown(false);
                        }}
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="block px-5 py-3 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-semibold"
                        onClick={() => {
                          setActive("");
                          setShowUserDropdown(false);
                        }}
                      >
                        Register
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
          <Link 
            to="/cart" 
            onClick={() => setActive("")} 
            className="relative text-gray-700 hover:text-green-700 transition-colors duration-300 hover:scale-110"
          >
            <CiShoppingCart />
            {cartItems.length > 0 && (
              <span className="absolute top-[-8px] right-[-8px] bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                {cartItems.reduce((a, c) => a + c.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-xl border-b border-gray-200 z-50 md:hidden">
            <ul className="flex flex-col gap-2 p-5">
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
                  className={`px-5 py-3.5 rounded-lg transition-all duration-300 text-lg font-medium tracking-wide ${
                    active === "home"
                      ? "bg-green-100 text-green-800 font-bold shadow-sm"
                      : "text-gray-800 hover:bg-green-50 hover:text-green-700"
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
                  className={`px-5 py-3.5 rounded-lg transition-all duration-300 text-lg font-medium tracking-wide ${
                    active === "shop"
                      ? "bg-green-100 text-green-800 font-bold shadow-sm"
                      : "text-gray-800 hover:bg-green-50 hover:text-green-700"
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
                  className={`px-5 py-3.5 rounded-lg transition-all duration-300 text-lg font-medium tracking-wide ${
                    active === "subscription"
                      ? "bg-green-100 text-green-800 font-bold shadow-sm"
                      : "text-gray-800 hover:bg-green-50 hover:text-green-700"
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
                  className={`px-5 py-3.5 rounded-lg transition-all duration-300 text-lg font-medium tracking-wide ${
                    active === "about"
                      ? "bg-green-100 text-green-800 font-bold shadow-sm"
                      : "text-gray-800 hover:bg-green-50 hover:text-green-700"
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
                  className={`px-5 py-3.5 rounded-lg transition-all duration-300 text-lg font-medium tracking-wide ${
                    active === "contact"
                      ? "bg-green-100 text-green-800 font-bold shadow-sm"
                      : "text-gray-800 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  CONTACT US
                </li>
              </Link>
              <li className="flex gap-4 items-center mt-2 pt-4 border-t border-gray-200">
                <CiSearch
                  className="cursor-pointer text-2xl text-gray-700 hover:text-green-700 transition-colors"
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
                  className="relative text-gray-700 hover:text-green-700 transition-colors"
                >
                  <CiShoppingCart className="text-2xl" />
                  {cartItems.length > 0 && (
                    <span className="absolute top-[-8px] right-[-8px] bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                      {cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <CiUser
                    className="cursor-pointer text-2xl text-gray-700 hover:text-green-700 transition-colors"
                    onClick={() => setShowMobileUserDropdown((prev) => !prev)}
                  />
                  {showMobileUserDropdown && (
                    <div className="absolute left-0 mt-2 w-52 rounded-lg bg-white shadow-xl border border-gray-100 z-50 overflow-hidden">
                      {userInfo ? (
                        <>
                          <div className="bg-gradient-to-r from-green-50 to-green-100 px-5 py-3.5 border-b border-gray-200">
                            <p className="text-base font-bold text-green-800">Hello, {firstname}</p>
                          </div>
                          <ul className="py-2">
                            {userInfo.isAdmin && (
                              <>
                                <li>
                                  <Link
                                    to="/admin/orderlist"
                                    className="block px-5 py-2.5 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
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
                                    className="block px-5 py-2.5 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
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
                                    className="block px-5 py-2.5 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
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
                                    className="block px-5 py-2.5 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
                                    onClick={() => {
                                      setActive("");
                                      setShowMobileUserDropdown(false);
                                    }}
                                  >
                                    Users
                                  </Link>
                                </li>
                                <li className="border-t border-gray-200 my-1"></li>
                              </>
                            )}
                            <li>
                              <Link
                                to="/profile"
                                className="block px-5 py-2.5 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
                                onClick={() => {
                                  setActive("");
                                  setShowMobileUserDropdown(false);
                                }}
                              >
                                Profile
                              </Link>
                            </li>
                            <li className="border-t border-gray-200 my-1"></li>
                            <li>
                              <button
                                type="button"
                                className="w-full text-left block px-5 py-2.5 text-base text-red-600 hover:bg-red-50 transition-colors font-medium"
                                onClick={handleLogout}
                              >
                                Logout
                              </button>
                            </li>
                          </ul>
                        </>
                      ) : (
                        <ul className="py-2">
                          <li>
                            <Link
                              to="/login"
                              className="block px-5 py-3 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-semibold"
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
                              className="block px-5 py-3 text-base text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-semibold"
                              onClick={() => {
                                setActive("");
                                setShowMobileUserDropdown(false);
                              }}
                            >
                              Register
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
      {showSearch && (
        <div className="w-full flex justify-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 shadow-md border-b border-gray-200">
          <div className="max-w-2xl w-full">
            <SearchBox />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
