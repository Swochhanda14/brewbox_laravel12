import { useEffect, useState } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import { useUpdateUserMutation, useGetUserDetailsQuery, useGetUsersQuery } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSpinner, FaSave, FaUserShield } from 'react-icons/fa';

const AdminUpdateUser = () => {
      const { id: userIdParam } = useParams();
      // Ensure userId is a string (URL params are always strings)
      const userId = String(userIdParam);
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [number, setNumber] = useState('');
      const [isAdmin, setIsAdmin] = useState(false);

      const { data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId);
      const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
      const { refetch: refetchUsersList } = useGetUsersQuery();

      const navigate = useNavigate();

      useEffect(() => {
        if (user) {
          setName(user.name || '');
          setEmail(user.email || '');
          setNumber(user.number || '');
          setIsAdmin(user.isAdmin || user.is_admin || false);
        }
      }, [user]);

      const submitHandler = async (e) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const emailPattern = /^\S+@\S+\.\S+$/;

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

        try {
          const updateData = {
            userId,
            name: trimmedName,
            email,
            number,
            isAdmin
          };

          console.log('Updating user with data:', updateData);
          const result = await updateUser(updateData).unwrap();
          console.log('Update result:', result);
          
          // Refetch the users list to ensure updated data is shown
          await refetchUsersList();
          
          toast.success("User Updated Successfully!");
          navigate('/admin/userlist', { replace: true });
        } catch (err) {
          console.error('Update error:', err);
          // Handle Laravel validation errors
          if (err?.data?.errors) {
            const errors = err.data.errors;
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
            // If there are other errors, show the first one
            const firstError = Object.values(errors)[0];
            if (firstError && firstError.length > 0) {
              toast.error(firstError[0]);
              return;
            }
          }
          
          // Handle general error messages
          const msg = err?.data?.message || err?.error || '';
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
            toast.error("User update failed. Please check your input.");
          }
        }
      }

         
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FaSpinner className="text-5xl text-green-700 animate-spin mb-4" />
        <p className="text-gray-600">Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600">Error loading user details</p>
      </div>
    );
  }

  return (
     <div className="w-full">
        <div className="mb-6">
          <Link 
            to='/admin/userlist' 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors mb-4"
          >
            <FaArrowLeft />
            <span className="font-medium">Back to Users</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Update User</h2>
          <p className="text-gray-600">Edit user information and permissions</p>
        </div>
        {loadingUpdate && (
          <div className="flex items-center justify-center gap-2 text-green-700 mb-4">
            <FaSpinner className="animate-spin" />
            <span>Updating user...</span>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 max-w-2xl">
          <form onSubmit={submitHandler} className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-semibold text-gray-700' htmlFor="name">Username</label>
              <input 
                className='border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white' 
                type="text" 
                placeholder='John Doe' 
                value={name ?? ''} 
                onChange={(e)=>setName(e.target.value)} 
                required 
                minLength={5} 
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-semibold text-gray-700' htmlFor="email">Email</label>
              <input 
                className='border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white' 
                type="email" 
                placeholder='example@gmail.com' 
                value={email ?? ''} 
                onChange={(e)=>setEmail(e.target.value)} 
                required 
                inputMode="email" 
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-semibold text-gray-700' htmlFor="number">Phone Number</label>
              <input 
                className='border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white' 
                type="tel" 
                placeholder='98XXXXXXXX' 
                value={number ?? ''} 
                onChange={(e)=>setNumber(e.target.value)} 
                required 
                inputMode="numeric" 
                pattern="^98\d{8}$" 
              />
            </div>
            <div className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200'>
              <input 
                type="checkbox" 
                id="isAdmin" 
                checked={isAdmin} 
                onChange={(e)=>setIsAdmin(e.target.checked)}
                className='w-5 h-5 accent-green-600'
              />
              <label className='text-sm font-semibold text-gray-700 flex items-center gap-2 cursor-pointer' htmlFor="isAdmin">
                <FaUserShield className="text-green-600" />
                Admin User
              </label>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                type='submit' 
                className='flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2' 
                disabled={loadingUpdate}
              >
                {loadingUpdate ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {loadingUpdate ? "Updating..." : "Update User"}
              </button>
              <Link
                to="/admin/userlist"
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
  )
}

export default AdminUpdateUser
