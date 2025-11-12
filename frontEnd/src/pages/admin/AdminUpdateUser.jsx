import { useEffect, useState } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import { useUpdateUserMutation, useGetUserDetailsQuery, useGetUsersQuery } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';

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
    return <div className='flex justify-center items-center h-64'><p>Loading...</p></div>;
  }

  if (error) {
    return <div className='flex justify-center items-center h-64'><p>Error loading user details</p></div>;
  }

  return (
     <div className=''>
        <div className='flex flex-col items-center gap-5 mb-10 mt-5'>
            <Link to='/admin/userlist' className='bg-green-700 text-white px-2 py-1 rounded'>Go Back</Link>
        <h2 className="text-2xl font-bold mt-4 text-gray-700">Update User Detail</h2>
        {loadingUpdate && <p>Loading...</p>}
        <form onSubmit={submitHandler} className='w-full max-w-md mt-8 flex flex-col gap-6 px-4'>
            <div className='flex flex-col gap-2'>
            <label className='text-xl font-semibold text-gray-600'  htmlFor="name">Username</label>
            <input className='border rounded p-2 text-lg' type="text" placeholder='John Doe' value={name ?? ''} onChange={(e)=>setName(e.target.value)} required minLength={5} />
            </div>
            <div className='flex flex-col gap-2'>
            <label className='text-xl font-semibold text-gray-600'  htmlFor="email">Email</label>
            <input className='border rounded p-2 text-lg' type="email" placeholder='example@gmail.com' value={email ?? ''} onChange={(e)=>setEmail(e.target.value)} required inputMode="email" />
            </div>
            <div className='flex flex-col gap-2'>
            <label className='text-xl font-semibold text-gray-600'  htmlFor="number">Phone Number</label>
            <input className='border rounded p-2 text-lg' type="tel" placeholder='98XXXXXXXX' value={number ?? ''} onChange={(e)=>setNumber(e.target.value)} required inputMode="numeric" pattern="^98\d{8}$" />
            </div>
            <div className='flex items-center gap-2'>
            <input 
              type="checkbox" 
              id="isAdmin" 
              checked={isAdmin} 
              onChange={(e)=>setIsAdmin(e.target.checked)}
              className='w-5 h-5'
            />
            <label className='text-xl font-semibold text-gray-600' htmlFor="isAdmin">Admin User</label>
            </div>
            <button type='submit' className='py-3 px-7 bg-green-800 text-lg text-white font-semibold rounded hover:bg-green-700 hover:cursor-pointer disabled:opacity-50' disabled={loadingUpdate}>Update</button>
        </form>
        </div>
      </div>
  )
}

export default AdminUpdateUser
