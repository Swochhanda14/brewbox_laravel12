import { useEffect, useState } from 'react';
import { useParams, useNavigate,Link } from 'react-router-dom';
import { useUpdateUserMutation, useGetUserDetailsQuery } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';

const AdminUpdateUser = () => {
      const { id: userId } = useParams();
        // console.log(userId);
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [number, setNumber] = useState('');

      const { data: user, isLoading, refetch, error } = useGetUserDetailsQuery(userId);
      const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

      const navigate = useNavigate();

      useEffect(() => {
        if (user) {
          setName(user.name);
          setEmail(user.email);
          setNumber(user.number);
        }
      }, [user]);

      const submitHandler = async (e) => {
        e.preventDefault();
        try {
          await updateUser({
            userId,
            name,
            email,
            number
          }).unwrap();
          toast.success("User Updated Successfully!");
          navigate('/admin/userlist', { replace: true });
        } catch (err) {
          toast.error(err?.data?.message || err?.error || 'Failed to update user');
        }
      }

         
  return (
     <div className=''>
        <div className='flex flex-col items-center gap-5 mb-10 mt-5'>
            <Link to='/admin/userlist' className='bg-green-700 text-white px-2 py-1 rounded'>Go Back</Link>
        <h2 className="text-2xl font-bold mt-4 text-gray-700">Update User Detail</h2>
        {loadingUpdate && <p>Loading...</p>}
        <form onSubmit={submitHandler} className='w-1/3 mt-8 flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
            <label className='text-xl font-semibold text-gray-600'  htmlFor="name">Username</label>
            <input className='border rounded p-2 text-lg' type="text" placeholder='John Doe' value={name ?? ''} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
            <label className='text-xl font-semibold text-gray-600'  htmlFor="email">Email</label>
            <input className='border rounded p-2 text-lg' type="text" placeholder='example@gmail.com' value={email ?? ''} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
            <label className='text-xl font-semibold text-gray-600'  htmlFor="number">Phone Number</label>
            <input className='border rounded p-2 text-lg' type="text" placeholder='Enter Phone number' value={number ?? ''} onChange={(e)=>setNumber(e.target.value)} />
            </div>
            <button type='submit' className='py-3 px-7 bg-green-800 text-lg text-white font-semibold rounded hover:bg-green-700 hover:cursor-pointer disabled:opacity-50' disabled={loadingUpdate}>Update</button>
        </form>
        </div>
      </div>
  )
}

export default AdminUpdateUser
