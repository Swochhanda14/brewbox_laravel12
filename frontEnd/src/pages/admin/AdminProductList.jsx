import {Link,useParams} from 'react-router-dom'
import { useGetProductsQuery } from "../../slices/productApiSlice";
import { useCreateProductMutation,useDeleteProductMutation } from '../../slices/productApiSlice';
import { FaEdit, FaTrash, FaList } from "react-icons/fa";
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
		<div className="">
			<div className="flex items-center justify-between">
				<div className="flex items-center text-2xl gap-2">
					<FaList />
					<p>Products List</p>
				</div>
				<div>
						<Link to="/admin/product/create">
							<button className="flex items-center text-xl gap-2 bg-green-600 px-3 py-2 rounded text-white">
						<FaEdit />
						Add Product
						</button>
						</Link>
				</div>
			</div>
      {loadingDelete && <>Loading...</>}
			{isLoading ? (
				<>Loading...</>
			) : error ? (
				<>
					{typeof error === 'string'
						? error
						: error?.data?.message || error?.error || 'Failed to load products'}
				</>
			) : (
				<>
					<div class="overflow-hidden mt-10 ">
						<table class=" min-w-full rounded-xl">
							<thead>
								<tr class="bg-gray-50 uppercase">
									<th
										scope="col"
										class="p-5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl"
									>
										{" "}
										Id{" "}
									</th>
									<th
										scope="col"
										class="p-5 text-left text-sm leading-6 font-semibold text-gray-900"
									>
										{" "}
										Name{" "}
									</th>
									<th
										scope="col"
										class="p-5 text-left text-sm leading-6 font-semibold text-gray-900"
									>
										{" "}
										Price{" "}
									</th>
									<th
										scope="col"
										class="p-5 text-left text-sm leading-6 font-semibold text-gray-900"
									>
										{" "}
										Category{" "}
									</th>
									<th
										scope="col"
										class="p-5 text-left text-sm leading-6 font-semibold text-gray-900 rounded-t-xl"
									>
										{" "}
										Actions{" "}
									</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-300 ">
								{data.products.map((product) => (
									<tr
										key={product.id}
										class="bg-white transition-all duration-500 hover:bg-gray-50"
									>
										<td class="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900 ">
											{product.id}
										</td>
										<td class="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
											{product.product_name}
										</td>
										<td class="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
											Rs.{product.min_price} - Rs.{product.max_price}
										</td>
										<td class="p-5 whitespace-nowrap text-sm leading-6 font-medium text-gray-900">
											{product.category}
										</td>
										<td class=" p-5 ">
											<div class="flex items-center gap-1">
												<Link to={`/admin/product/${product.id}/edit`}>
                          <button class="p-2 rounded-full text-blue-500 hover:cursor-pointer disabled:opacity-50"
														disabled={loadingDelete}
													>
                            <FaEdit />
                          </button>
                        </Link>
												<button
													onClick={()=>deleteHandler(product.id)}
													class="p-2 rounded-full text-red-600 hover:cursor-pointer disabled:opacity-50"
													disabled={loadingDelete}
												>
													<FaTrash />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<Paginate pages={data.pages} page={data.page} isAdmin={true} />
						
					</div>
				</>
			)}
		</div>
	);
};

export default AdminProductList;
