import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetTopProductsQuery } from '../slices/productApiSlice';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!Array.isArray(products) || products.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 5000); // Change slide every 5s

    return () => clearInterval(interval);
  }, [products]);

  if (isLoading) return null;
  if (error) return <p className="text-red-500 text-center mt-4">{error.message}</p>;

  return (
    <div className="relative overflow-hidden w-full h-64 sm:h-80 md:h-96 mb-6 rounded-lg shadow-lg">
      {(products ?? []).map((product, index) => (
        <div
          key={product.id ?? product._id ?? index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Link to={`/product/${product.id ?? product._id}`} className="block w-full h-full p-5">
            <img
              src={Array.isArray(product.image) ? product.image[0] : product.image}
              alt={product.product_name}
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 px-4 py-2 rounded text-white text-right">
              <h2 className="text-lg sm:text-xl font-semibold">
                {product.product_name} (Rs.{product.min_price} - Rs.{product.max_price})
              </h2>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductCarousel;
