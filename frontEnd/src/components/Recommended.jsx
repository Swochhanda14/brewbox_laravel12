import React from 'react';
import ProductCard from './ProductCard';
import { useGetRecommendedProductsQuery } from '../slices/productApiSlice'

const Recommended = () => {
  const { data, error, isLoading } = useGetRecommendedProductsQuery();

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 flex flex-col items-center">
        Recommended
        <span className="h-[4px] sm:h-[5px] md:h-[6px] w-24 sm:w-32 md:w-48 bg-green-800 rounded mt-1"></span>
      </h1>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error.data?.message || error.error || 'Error loading recommendations'}</div>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-10 m-4 sm:m-6 md:m-10 w-full">
                {data && data.length > 0 ? (
                  data.map((p) => <ProductCard product={p} key={p.id} />)
                ) : (
                  <div>No recommendations available.</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Recommended;
