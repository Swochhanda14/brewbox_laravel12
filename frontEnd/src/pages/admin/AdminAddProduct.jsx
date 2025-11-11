import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
	useCreateProductMutation,
	useUploadProductImageMutation,
} from "../../slices/productApiSlice";
import { toast } from "react-toastify";
import { BASE_URL } from "../../constants";

const AdminAddProduct = () => {
	const [name, setName] = useState("");
	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(0);
	const [images, setImages] = useState([]);
	const [category, setCategory] = useState("");
	const [countInStock, setCountInStock] = useState(0);
	const [description, setDecription] = useState("");

	const [createProduct, { isLoading: loadingCreate, error }] =
		useCreateProductMutation();

	const [uploadProductImage, { isLoading: loadingUpload }] =
		useUploadProductImageMutation();

	const navigate = useNavigate();

	// useEffect(()=>{
	//   if(product){
	//     setName(product.product_name);
	//     setMinPrice(product.min_price);
	//     setMaxPrice(product.max_price);
	//     setImage(product.image);
	//     setCategory(product.category);
	//     setCountInStock(product.countInStock);
	//     setDecription(product.description);
	//   }
	// },[product])

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			await createProduct({
				product_name: name,
				min_price: minPrice,
				max_price: maxPrice,
				image: images, // now an array
				category,
				countInStock,
				description,
			}).unwrap();
			toast.success("Product Added Successfully!");
			navigate("/admin/productlist");
		} catch (err) {
			toast.error(err?.data?.message || err.error);
		}
	};

	const uploadFileHandler = async (e) => {
		const files = Array.from(e.target.files);
		const formData = new FormData();
		files.forEach((file) => formData.append("images[]", file));

		try {
			const res = await uploadProductImage(formData).unwrap();
			setImages((prevImages) => [...prevImages, ...res.images]); // append instead of replace
			toast.success(res.message);
		} catch (err) {
			toast.error(err?.data?.message || err.error);
		}
	};
	const removeImageHandler = (idx) => {
		setImages((prev) => prev.filter((_, index) => index !== idx));
	};

	return (
		<div className="">
			<Link
				to="/admin/productlist"
				className="bg-green-700 text-white px-2 py-1 rounded"
			>
				Go Back
			</Link>
			<h2 className="text-2xl font-bold mt-4 text-gray-700">Add Product</h2>

			{loadingCreate && <>Loading...</>}
			{loadingUpload ? (
				<>Loading...</>
			) : error ? (
				<div className="text-red-500">
					{error?.data?.message || error.error}
				</div>
			) : (
				<div className="flex  gap-20">
					<form
						onSubmit={submitHandler}
						className="flex flex-col gap-4 w-1/2 mt-10 text-gray-700"
					>
						<div>
							<label htmlFor="name" className="text-lg font-semibold">
								Product Name
							</label>
							<input
								type="text"
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="border-2 border-gray-300 rounded px-2 py-1 w-full"
							/>
						</div>
						<div>
							<label htmlFor="minPrice" className="text-lg font-semibold">
								Min Price
							</label>
							<input
								type="number"
								id="minPrice"
								value={minPrice}
								onChange={(e) => setMinPrice(e.target.value)}
								className="border-2 border-gray-300 rounded px-2 py-1 w-full"
							/>
						</div>
						<div>
							<label htmlFor="maxPrice" className="text-lg font-semibold">
								Max Price
							</label>
							<input
								type="number"
								id="maxPrice"
								value={maxPrice}
								onChange={(e) => setMaxPrice(e.target.value)}
								className="border-2 border-gray-300 rounded px-2 py-1 w-full"
							/>
						</div>
						<div>
							<label htmlFor="images" className="text-lg font-semibold">
								Images
							</label>
							<input
								type="file"
								id="images"
								multiple
								onChange={uploadFileHandler}
								className="border-2 border-gray-300 rounded px-2 py-1 w-full"
							/>
							<div className="flex flex-wrap gap-2 mt-2">
								{images &&
									images.map((img, idx) => (
										<div key={idx} className="relative">
											<img
												src={
													img.startsWith("http") ? img : `${BASE_URL}${img}`
												}
												alt={`product-${idx}`}
												className="w-20 h-20 object-cover border-2 border-gray-300 rounded"
											/>
											<button
												type="button"
												onClick={() => removeImageHandler(idx)}
												className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
												title="Remove image"
											>
												X
											</button>
										</div>
									))}
							</div>
						</div>
						<div>
							<label htmlFor="category" className="text-lg font-semibold">
								Category
							</label>
							<input
								type="text"
								id="category"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								className="border-2 border-gray-300 rounded px-2 py-1 w-full"
							/>
						</div>
						<div>
							<label htmlFor="countInStock" className="text-lg font-semibold">
								Count In Stock
							</label>
							<input
								type="number"
								id="countInStock"
								value={countInStock}
								onChange={(e) => setCountInStock(e.target.value)}
								className="border-2 border-gray-300 rounded px-2 py-1 w-full"
							/>
						</div>
						<div>
							<label htmlFor="description" className="text-lg font-semibold">
								Description
							</label>
							<textarea
								id="description"
								value={description}
								onChange={(e) => setDecription(e.target.value)}
								className="border-2 border-gray-300 rounded px-2 py-1 w-full"
							/>
						</div>
						<button className="bg-green-700 text-white px-4 py-2 rounded">
							Add
						</button>
					</form>
				</div>
			)}
		</div>
	);
};
export default AdminAddProduct;
