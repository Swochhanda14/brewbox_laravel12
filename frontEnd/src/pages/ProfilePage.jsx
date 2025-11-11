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
        if(password!==confirmPassword){
            toast.error("Password donot match!");
        }else{
            try{
                const res = await updateProfile({_id:userInfo._id,name,email,number,password}).unwrap();
                dispatch(setCredentials(res));
                toast.success("Profile Updated Successfully");
            }catch(error){
                toast.error(error?.data?.message || error.error);
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
              <input className='border rounded p-2 text-base sm:text-lg' type="text" placeholder='John Doe' value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="email">Email</label>
              <input className='border rounded p-2 text-base sm:text-lg' type="text" placeholder='example@gmail.com' value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="number">Phone Number</label>
              <input className='border rounded p-2 text-base sm:text-lg' type="text" placeholder='98XXXXXXXX' value={number} onChange={(e)=>setNumber(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="password">Password</label>
              <input className='border rounded p-2 text-base sm:text-lg' type="password" placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="confirmPassword">Confirm Password</label>
              <input className='border rounded p-2 text-base sm:text-lg' type="password" placeholder='Re-enter Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
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
