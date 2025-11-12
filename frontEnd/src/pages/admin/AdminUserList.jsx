import {Link,useParams} from 'react-router-dom'
import { useGetUsersQuery } from "../../slices/usersApiSlice";
import { useRegisterMutation,useDeleteUserMutation } from '../../slices/usersApiSlice';
import { FaEdit, FaTrash, FaList } from "react-icons/fa";
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
        <div className="">
            <div className="flex items-center justify-between">
                <div className="flex items-center text-2xl gap-2">
                    <FaList />
                    <p>Users List</p>
                </div>
            </div>
      {loadingDelete && <>Loading...</>}
            {isLoading ? (
                <>Loading...</>
            ) : error ? (
                <>
                  {typeof error === 'string'
                    ? error
                    : error?.data?.message || error?.error || 'Failed to load users'}
                </>
            ) : (
                <>
                    <div className="overflow-hidden mt-6">
                        <table className=" min-w-full rounded-xl">
                            <thead>
                                <tr className="bg-gray-50 uppercase">
                                    <th
                                        scope="col"
                                        className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl"
                                    >
                                        {" "}
                                        Id{" "}
                                    </th>
                                    <th
                                        scope="col"
                                        className="p-5 text-left text-sm leading-6 font-semibold text-gray-900"
                                    >
                                        {" "}
                                        Name{" "}
                                    </th>
                                    <th
                                        scope="col"
                                        className="p-5 text-left text-sm leading-6 font-semibold text-gray-900"
                                    >
                                        {" "}
                                        Email{" "}
                                    </th>
                                    <th
                                        scope="col"
                                        className="p-5 text-left text-sm leading-6 font-semibold text-gray-900"
                                    >
                                        {" "}
                                        Admin{" "}
                                    </th>
                                    <th
                                        scope="col"
                                        className="p-5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl"
                                    >
                                        {" "}
                                        Actions{" "}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300 ">
                                {users.map((user) => (
                                    <tr
                                        key={user.id || user._id}
                                        className="bg-white transition-all duration-500 hover:bg-gray-50"
                                    >
                                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
                                            {user.id || user._id}
                                        </td>
                                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                                            {user.email}
                                        </td>
                                        <td className="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
                                            {(user.isAdmin ?? user.is_admin) ? "Yes" : "No"}
                                        </td>
                                        <td className=" p-5 ">
                                            <div className="flex items-center gap-1">
                                                <Link to={`/admin/user/${user.id || user._id}/edit`}>
                                                <button className="p-2 rounded-full text-blue-500 hover:cursor-pointer disabled:opacity-50" disabled={loadingDelete}>
                                                    <FaEdit />
                                                </button>
                                                </Link>
                                                <button onClick={()=>deleteHandler(user.id || user._id)} className="p-2 rounded-full text-red-600 hover:cursor-pointer disabled:opacity-50" disabled={loadingDelete}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* <Paginate pages={data.pages} page={data.page} isAdmin={true} /> */}
                        
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminUserList;
