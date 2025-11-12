import {Link,useParams} from 'react-router-dom'
import { useGetUsersQuery } from "../../slices/usersApiSlice";
import { useRegisterMutation,useDeleteUserMutation } from '../../slices/usersApiSlice';
import { FaEdit, FaTrash, FaList, FaSpinner, FaUserShield } from "react-icons/fa";
import Paginate from '../../components/Paginate';
import {toast} from 'react-toastify'


const AdminUserList = () => {
    //  const { pageNumber } = useParams();

      const { data:users, isLoading, error, refetch } = useGetUsersQuery({
        // pageNumber,
      });
    // console.log(products);
    // const [createProduct, { isLoading: loadingCreate }] =
    // 	useCreateProductMutation();
    

   const [deleteUser, { isLoading: loadingDelete }] =
      useDeleteUserMutation();
  
    const deleteHandler = async (id) => {
      if (window.confirm('Are you sure')) {
        try {
          await deleteUser(id).unwrap();
          refetch();
          toast.success("User Deleted Successfully!")
        } catch (err) {
          toast.error(err?.data?.message || err?.error || 'Failed to delete user');
        }
      }
    };
  

//   const createProductHandler = async () => {
// 	  if (window.confirm('Are you sure you want to create a new product?')) {
// 		try {
// 		  await createProduct();
// 		  toast.success("Product Added Successfully!")
// 		  refetch();
// 		} catch (err) {
// 		  toast.error(err?.data?.message || err.error);
// 		}
// 	  }
// 	};

    return (
        <div className="w-full">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <FaList className="text-green-700 text-xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Users List</h2>
                        <p className="text-gray-600 text-sm">Manage user accounts</p>
                    </div>
                </div>
            </div>
            {loadingDelete && (
                <div className="flex items-center justify-center gap-2 text-green-700 mb-4">
                    <FaSpinner className="animate-spin" />
                    <span>Deleting user...</span>
                </div>
            )}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <FaSpinner className="text-5xl text-green-700 animate-spin mb-4" />
                    <p className="text-gray-600">Loading users...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600">
                        {typeof error === 'string'
                            ? error
                            : error?.data?.message || error?.error || 'Failed to load users'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id || user._id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{user.id || user._id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(user.isAdmin ?? user.is_admin) ? (
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 flex items-center gap-1 w-fit">
                                                    <FaUserShield />
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                                    User
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                <Link to={`/admin/user/${user.id || user._id}/edit`}>
                                                    <button 
                                                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors disabled:opacity-50" 
                                                        disabled={loadingDelete}
                                                        title="Edit User"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={()=>deleteHandler(user.id || user._id)} 
                                                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50" 
                                                    disabled={loadingDelete}
                                                    title="Delete User"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserList;
