import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUpdateProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation } from '../../slices/productApiSlice';
import { apiSlice } from '../../slices/apiSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../constants';
import { FaArrowLeft, FaSpinner, FaTimes, FaUpload, FaSave } from 'react-icons/fa';

const AdminUpdateProduct = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [replaceImages, setReplaceImages] = useState(false);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDecription] = useState('');

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const dispatch = useDispatch();

  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.product_name);
      setMinPrice(product.min_price);
      setMaxPrice(product.max_price);
      setImages(Array.isArray(product.image) ? product.image : [product.image]);
      setCategory(product.category);
      // Backend returns count_in_stock; map to frontend state
      setCountInStock(product.count_in_stock ?? product.countInStock ?? 0);
      setDecription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        product_name: name,
        min_price: Number(minPrice),
        max_price: Number(maxPrice),
        image: images,
        category: category,
        countInStock: Number(countInStock),
        description: description
      }).unwrap();
      
      // Invalidate all product queries to force refetch
      dispatch(apiSlice.util.invalidateTags(['Products', 'Product']));
      
      toast.success("Product Updated Successfully!");
      navigate('/admin/productlist', { replace: true });
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'Failed to update product');
    }
  }

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((file) => formData.append("images[]", file));
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImages((prev) => replaceImages ? [...res.images] : [...prev, ...res.images]);
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  const removeImageHandler = (idx) => {
    setImages((prev) => prev.filter((_, index) => index !== idx));
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link 
          to='/admin/productlist' 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors mb-4"
        >
          <FaArrowLeft />
          <span className="font-medium">Back to Products</span>
        </Link>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Update Product</h2>
        <p className="text-gray-600">Edit product information</p>
      </div>

      {loadingUpdate && (
        <div className="flex items-center justify-center gap-2 text-green-700 mb-4">
          <FaSpinner className="animate-spin" />
          <span>Updating product...</span>
        </div>
      )}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FaSpinner className="text-5xl text-green-700 animate-spin mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error?.data?.message || error.error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <form onSubmit={submitHandler} className='flex flex-col gap-6'>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                <input 
                  type="text" 
                  id='name' 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <input 
                  type="text" 
                  id='category' 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="minPrice" className="block text-sm font-semibold text-gray-700 mb-2">Min Price (Rs.)</label>
                <input 
                  type="number" 
                  id='minPrice' 
                  value={minPrice} 
                  onChange={(e) => setMinPrice(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                  required
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-semibold text-gray-700 mb-2">Max Price (Rs.)</label>
                <input 
                  type="number" 
                  id='maxPrice' 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                  required
                  min="0"
                />
              </div>
            </div>
            <div>
              <label htmlFor="countInStock" className="block text-sm font-semibold text-gray-700 mb-2">Count In Stock</label>
              <input 
                type="number" 
                id='countInStock' 
                value={countInStock} 
                onChange={(e) => setCountInStock(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
                required
                min="0"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea 
                id='description' 
                value={description} 
                onChange={(e) => setDecription(e.target.value)} 
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white resize-none"
                required
              />
            </div>
            <div>
              <label htmlFor="images" className="block text-sm font-semibold text-gray-700 mb-2">Product Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                <input
                  type="file"
                  id="images"
                  multiple
                  onChange={uploadFileHandler}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer flex flex-col items-center gap-2">
                  <FaUpload className="text-3xl text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload images</span>
                  <span className="text-xs text-gray-500">Multiple images supported</span>
                </label>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={replaceImages}
                    onChange={(e) => setReplaceImages(e.target.checked)}
                    className="w-4 h-4 accent-green-600"
                  />
                  <span className="text-sm text-gray-700">Replace existing images</span>
                </label>
                <button
                  type="button"
                  onClick={() => setImages([])}
                  className="text-sm px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  Clear all images
                </button>
              </div>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img.startsWith("http") ? img : `${BASE_URL}${img}`}
                        alt={`product-${idx}`}
                        className="w-24 h-24 object-cover border-2 border-gray-300 rounded-lg shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageHandler(idx)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition-colors"
                        title="Remove image"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2" 
                disabled={loadingUpdate || isLoading}
              >
                {loadingUpdate ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {loadingUpdate ? "Updating..." : "Update Product"}
              </button>
              <Link
                to="/admin/productlist"
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );

}
export default AdminUpdateProduct;
