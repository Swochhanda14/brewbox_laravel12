import {Link,useParams} from 'react-router-dom'
import { useGetProductsQuery } from "../../slices/productApiSlice";
import { useCreateProductMutation,useDeleteProductMutation } from '../../slices/productApiSlice';
import { FaEdit, FaTrash, FaList, FaSpinner, FaPlus } from "react-icons/fa";
import Paginate from '../../components/Paginate';
import {toast} from 'react-toastify'


const AdminProductList = () => {
	 const { pageNumber } = useParams();
	
	  const { data, isLoading, error, refetch } = useGetProductsQuery({
		pageNumber,
	  });
	// console.log(products);
	// const [createProduct, { isLoading: loadingCreate }] =
	// 	useCreateProductMutation();
	

   const [deleteProduct, { isLoading: loadingDelete }] =
	  useDeleteProductMutation();
  
	const deleteHandler = async (id) => {
	  if (window.confirm('Are you sure')) {
		try {
		  await deleteProduct(id).unwrap();
		  refetch();
		  toast.success("Product Deleted Successfully!")
		} catch (err) {
		  toast.error(err?.data?.message || err?.error || 'Failed to delete product');
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
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<FaList className="text-green-700 text-xl" />
						</div>
						<div>
							<h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Products List</h2>
							<p className="text-gray-600 text-sm">Manage your product catalog</p>
						</div>
					</div>
					<Link to="/admin/product/create">
						<button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
							<FaPlus />
							Add Product
						</button>
					</Link>
				</div>
			</div>
      {loadingDelete && (
				<div className="flex items-center justify-center gap-2 text-green-700 mb-4">
					<FaSpinner className="animate-spin" />
					<span>Deleting product...</span>
				</div>
			)}
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-20">
					<FaSpinner className="text-5xl text-green-700 animate-spin mb-4" />
					<p className="text-gray-600">Loading products...</p>
				</div>
			) : error ? (
				<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
					<p className="text-red-600">
						{typeof error === 'string'
							? error
							: error?.data?.message || error?.error || 'Failed to load products'}
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
										Price
									</th>
									<th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
										Category
									</th>
									<th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{data.products.map((product) => (
									<tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											#{product.id}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
											{product.product_name}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
											Rs. {product.min_price} - Rs. {product.max_price}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 capitalize">
												{product.category}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm">
											<div className="flex items-center gap-2">
												<Link to={`/admin/product/${product.id}/edit`}>
													<button 
														className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors disabled:opacity-50"
														disabled={loadingDelete}
														title="Edit Product"
													>
														<FaEdit />
													</button>
												</Link>
												<button
													onClick={()=>deleteHandler(product.id)}
													className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50"
													disabled={loadingDelete}
													title="Delete Product"
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
					{data.pages && data.pages > 1 && (
						<div className="p-4 border-t border-gray-200">
							<Paginate pages={data.pages} page={data.page} isAdmin={true} />
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default AdminProductList;
