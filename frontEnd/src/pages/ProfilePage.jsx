import {useState,useEffect, useMemo} from 'react'
import { Link } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useProfileMutation } from '../slices/usersApiSlice'
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice'
import Banner from '../components/Banner'
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaLock, FaSpinner, FaCheckCircle, FaShoppingBag, FaEye } from 'react-icons/fa'
// import { set } from 'mongoose'

const ProfilePage = (props) => {
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [number,setNumber]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");

    const dispatch = useDispatch();

    const {userInfo} = useSelector((state)=>state.auth);
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();


    const [updateProfile , {isLoading:loadingUpdateProfile}] = useProfileMutation();

    useEffect(()=>{
        if(userInfo){
            setName(userInfo.name);
            setEmail(userInfo.email);
            setNumber(userInfo.number);
        }
    },[userInfo]);

    const submitHandler= async(e)=>{
        e.preventDefault();

        const trimmedName = name.trim();
        const emailPattern = /^\S+@\S+\.\S+$/;
        const passwordComplexity = /^(?=.*[A-Z])(?=.*[!@#$%^&*()[\]{}_\-+=~`|\\:;"'<>,.?/]).{8,}$/;

        // Username validation
        if (trimmedName.length < 5) {
            toast.error("Username must be at least 5 characters");
            return;
        }

        // Email validation
        if(!emailPattern.test(email)){
            toast.error("Please enter a valid email address");
            return;
        }

        // Phone number validation: must be 10 digits and start with 98
        if(!/^98\d{8}$/.test(number)){
            toast.error("Phone number must be 10 digits and start with 98");
            return;
        }

        // Password validation (only if password is provided)
        if(password || confirmPassword){
            if(password !== confirmPassword){
                toast.error("Password donot match!");
                return;
            }
            // Password complexity
            if(!passwordComplexity.test(password)){
                toast.error("Password must be at least 8 characters, include 1 uppercase letter and 1 symbol");
                return;
            }
        }

        try{
            // Only send password if it's provided
            const updateData = {_id:userInfo._id, name: trimmedName, email, number};
            if(password){
                updateData.password = password;
            }
            
            const res = await updateProfile(updateData).unwrap();
            // Preserve the token when updating credentials
            const updatedUserInfo = {
                ...res,
                token: userInfo.token, // Preserve existing token
            };
            dispatch(setCredentials(updatedUserInfo));
            toast.success("Profile Updated Successfully");
            // Clear password fields after successful update
            setPassword("");
            setConfirmPassword("");
        }catch(error){
            // Handle Laravel validation errors
            if (error?.data?.errors) {
                const errors = error.data.errors;
                // Check for specific field errors
                if (errors.name && errors.name.length > 0) {
                    toast.error(errors.name[0]);
                    return;
                }
                if (errors.email && errors.email.length > 0) {
                    toast.error(errors.email[0]);
                    return;
                }
                if (errors.number && errors.number.length > 0) {
                    toast.error(errors.number[0]);
                    return;
                }
                if (errors.password && errors.password.length > 0) {
                    toast.error(errors.password[0]);
                    return;
                }
                // If there are other errors, show the first one
                const firstError = Object.values(errors)[0];
                if (firstError && firstError.length > 0) {
                    toast.error(firstError[0]);
                    return;
                }
            }
            
            // Handle general error messages
            const msg = error?.data?.message || error?.error || '';
            if (typeof msg === 'string' && msg.trim()) {
                const lower = msg.toLowerCase();
                if ((lower.includes('email')) && (lower.includes('taken') || lower.includes('exists') || lower.includes('already'))) {
                    toast.error("Email already in use");
                    return;
                }
                if ((lower.includes('phone') || lower.includes('number')) && (lower.includes('taken') || lower.includes('exists') || lower.includes('already'))) {
                    toast.error("Phone number already in use");
                    return;
                }
                if ((lower.includes('username') || lower.includes('name')) && (lower.includes('taken') || lower.includes('exists') || lower.includes('already'))) {
                    toast.error("Username already in use");
                    return;
                }
                toast.error(msg);
            } else {
                toast.error("Profile update failed. Please check your input.");
            }
        }
    }

    const [deliveredFilter, setDeliveredFilter] = useState("all");
      
      const filteredOrders = useMemo(() => {
        if (!orders) return [];
        const list = Array.isArray(orders) ? orders : [];
        if (deliveredFilter === "all") return list;
        if (deliveredFilter === "delivered")
          return list.filter((o) => (o.is_delivered ?? o.isDelivered));
        if (deliveredFilter === "notDelivered")
          return list.filter((o) => !(o.is_delivered ?? o.isDelivered));
        return list;
      }, [orders, deliveredFilter]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Banner title={props.title} />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
          {/* Profile Form Section */}
          <div className='w-full lg:w-1/2'>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 md:p-10">
              <div className="mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <FaUser className="text-green-700" />
                  Profile Settings
                </h2>
                <p className="text-gray-600 mt-2">Update your personal information and password</p>
              </div>
              <form onSubmit={submitHandler} className='flex flex-col gap-6'>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2' htmlFor="name">
                    <FaUser className="text-green-700" />
                    Username
                  </label>
                  <input 
                    className='border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white' 
                    type="text" 
                    placeholder='John Doe' 
                    value={name} 
                    onChange={(e)=>setName(e.target.value)} 
                    required 
                    minLength={5} 
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2' htmlFor="email">
                    <FaEnvelope className="text-green-700" />
                    Email Address
                  </label>
                  <input 
                    className='border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white' 
                    type="email" 
                    placeholder='example@gmail.com' 
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)} 
                    required 
                    inputMode="email" 
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2' htmlFor="number">
                    <FaPhone className="text-green-700" />
                    Phone Number
                  </label>
                  <input 
                    className='border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white' 
                    type="tel" 
                    placeholder='98XXXXXXXX' 
                    value={number} 
                    onChange={(e)=>setNumber(e.target.value)} 
                    required 
                    inputMode="numeric" 
                    pattern="^98\d{8}$" 
                  />
                </div>
                <div className='border-t border-gray-200 pt-4 mt-2'>
                  <p className='text-sm text-gray-500 mb-4'>Leave password fields blank to keep your current password</p>
                  <div className='flex flex-col gap-2 mb-4'>
                    <label className='text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2' htmlFor="password">
                      <FaLock className="text-green-700" />
                      New Password
                    </label>
                    <input 
                      className='border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white' 
                      type="password" 
                      placeholder='Enter New Password' 
                      value={password} 
                      onChange={(e)=>setPassword(e.target.value)} 
                      minLength={8} 
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2' htmlFor="confirmPassword">
                      <FaLock className="text-green-700" />
                      Confirm Password
                    </label>
                    <input 
                      className='border border-gray-300 rounded-lg px-4 py-3 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white' 
                      type="password" 
                      placeholder='Re-enter Password' 
                      value={confirmPassword} 
                      onChange={(e)=>setConfirmPassword(e.target.value)} 
                      minLength={8} 
                    />
                  </div>
                </div>
                <button 
                  type='submit' 
                  disabled={loadingUpdateProfile}
                  className='py-3 px-7 bg-gradient-to-r from-green-700 to-green-800 text-base sm:text-lg text-white font-semibold rounded-lg hover:from-green-800 hover:to-green-900 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                >
                  {loadingUpdateProfile ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Update Profile
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Orders Section */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-200'>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2 mb-4 sm:mb-0">
                  <FaShoppingBag className="text-green-700" />
                  My Orders
                </h2>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-700">Filter:</label>
                  <select
                    value={deliveredFilter}
                    onChange={(e) => setDeliveredFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                  >
                    <option value="all">All Orders</option>
                    <option value="delivered">Delivered</option>
                    <option value="notDelivered">Not Delivered</option>
                  </select>
                </div>
              </div>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FaSpinner className="text-4xl text-green-700 animate-spin mb-4" />
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-600 font-semibold">
                    {error?.data?.message || error.error || "Unable to load orders"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {filteredOrders && filteredOrders.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                          <tr key={order.id ?? order._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="text-sm font-semibold text-gray-800">#{order.id ?? order._id}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-600">
                                {(order.created_at ?? order.createdAt) ? (order.created_at ?? order.createdAt).substring(0, 10) : 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="text-sm font-bold text-green-700">
                                Rs. {Number(order.total_price ?? order.totalPrice ?? 0).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {(order.is_delivered ?? order.isDelivered) ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                  <FaCheckCircle />
                                  Delivered
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                  <FaTimes />
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center">
                              <Link
                                to={`/order/${order.id ?? order._id}`}
                                className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                              >
                                <FaEye />
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaShoppingBag className="text-3xl text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">No Orders Found</h3>
                      <p className="text-gray-600 mb-6">
                        {deliveredFilter === "all" 
                          ? "You haven't placed any orders yet." 
                          : `No ${deliveredFilter === "delivered" ? "delivered" : "pending"} orders found.`}
                      </p>
                      <Link
                        to="/shop"
                        className="inline-block px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-all duration-300 transform hover:scale-105"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
