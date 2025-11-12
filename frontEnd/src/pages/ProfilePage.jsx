import {useState,useEffect, useMemo} from 'react'
import { Link } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useProfileMutation } from '../slices/usersApiSlice'
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice'
import Banner from '../components/Banner'
import { FaTimes } from 'react-icons/fa'
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
    <div>
      <Banner title={props.title} />
      <div className='flex flex-col md:flex-row'>
        <div className='flex flex-col items-center gap-5 mb-10 w-full md:w-1/2'>
          <form onSubmit={submitHandler} className='mt-6 sm:mt-10 flex flex-col gap-6 w-full sm:w-2/3 md:w-4/5 lg:w-2/3 px-2 sm:px-0'>
            <div className='flex flex-col gap-2'>
              <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="name">Username</label>
              <input className='border rounded p-2 text-base sm:text-lg' type="text" placeholder='John Doe' value={name} onChange={(e)=>setName(e.target.value)} required minLength={5} />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="email">Email</label>
              <input className='border rounded p-2 text-base sm:text-lg' type="email" placeholder='example@gmail.com' value={email} onChange={(e)=>setEmail(e.target.value)} required inputMode="email" />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="number">Phone Number</label>
              <input className='border rounded p-2 text-base sm:text-lg' type="tel" placeholder='98XXXXXXXX' value={number} onChange={(e)=>setNumber(e.target.value)} required inputMode="numeric" pattern="^98\d{8}$" />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="password">Password (Leave blank to keep current password)</label>
              <input className='border rounded p-2 text-base sm:text-lg' type="password" placeholder='Enter New Password' value={password} onChange={(e)=>setPassword(e.target.value)} minLength={8} />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="confirmPassword">Confirm Password</label>
              <input className='border rounded p-2 text-base sm:text-lg' type="password" placeholder='Re-enter Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} minLength={8} />
            </div>
            <button type='submit' className='py-3 px-7 bg-green-800 text-base sm:text-lg text-white font-semibold rounded hover:bg-green-700 hover:cursor-pointer'>Update</button>
            {loadingUpdateProfile && <>Loading...</> }
          </form>
        </div>
        <div className="w-full md:w-1/2 mt-8 md:mt-10 pr-4">
          <div className='flex flex-col sm:flex-row items-end justify-between'>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-700">My Orders</h2>
            <div className="my-2 sm:my-4 text-sm sm:text-md">
              <label className="mr-2 font-medium">Filter by Delivered Status:</label>
              <select
                value={deliveredFilter}
                onChange={(e) => setDeliveredFilter(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="all">All</option>
                <option value="delivered">Delivered</option>
                <option value="notDelivered">Not Delivered</option>
              </select>
            </div>
          </div>
          {isLoading ? (
            <>Loading... </>
          ) : error ? (
            <>
              {error?.data?.message || error.error}
            </>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 font-semibold">ID</th>
                    <th className="px-2 sm:px-4 py-2 font-semibold">DATE</th>
                    <th className="px-2 sm:px-4 py-2 font-semibold">TOTAL</th>
                    <th className="px-2 sm:px-4 py-2 font-semibold">DELIVERED</th>
                    <th className="px-2 sm:px-4 py-2 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
{filteredOrders && filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id ?? order._id} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-4 py-2">{order.id ?? order._id}</td>
                        <td className="px-2 sm:px-4 py-2">{(order.created_at ?? order.createdAt) ? (order.created_at ?? order.createdAt).substring(0, 10) : 'N/A'}</td>
                        <td className="px-2 sm:px-4 py-2">Rs.{Number(order.total_price ?? order.totalPrice ?? 0).toFixed(2)}</td>
                        <td className="px-2 sm:px-4 py-2">
                          {(order.is_delivered ?? order.isDelivered) ? (
                            (order.delivered_at ?? order.deliveredAt) ? (order.delivered_at ?? order.deliveredAt).substring(0, 10) : '✔'
                          ) : (
                            <FaTimes className="text-red-600" />
                          )}
                        </td>
                        <td className="px-2 sm:px-4 py-2">
                          <Link
                            to={`/order/${order.id ?? order._id}`}
                            className="inline-block px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
