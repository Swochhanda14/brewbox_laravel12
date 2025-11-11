import { useRef } from 'react';
import ProductCard from './ProductCard';
import { useGetTopProductsQuery } from '../slices/productApiSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // or use your own icons


const TopRated = () => {
  const { data:products, isLoading, error } =useGetTopProductsQuery();
  const scrollRef = useRef();

  // Responsive scroll amount
  const scroll = (direction) => {
    if (scrollRef.current) {
      let scrollAmount = 300;
      if (window.innerWidth < 640) scrollAmount = 180;
      else if (window.innerWidth < 1024) scrollAmount = 240;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };


  return (
    <div className="flex flex-col items-center w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 flex flex-col items-center">Top Rated
            <span className='h-[4px] sm:h-[5px] md:h-[6px] w-24 sm:w-32 md:w-48 bg-green-800 rounded mt-1'></span>
            </h1>


      {isLoading ? (
        <div><h1>Loading...</h1></div>
      ) : error ? (
        <div>{error.data?.message || error.error}</div>
      ) : (
        <div className="relative mt-6 sm:mt-10 w-full px-2 sm:px-6 md:px-10">
          {/* Left Arrow - hidden on mobile */}
          <button
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 sm:gap-6 scroll-smooth w-full px-2 sm:px-10 hide-scrollbar"
          >
            {products.map((p) => (
              <div key={p.id} className="min-w-[180px] sm:min-w-[220px] md:min-w-[250px] flex-shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {/* Right Arrow - hidden on mobile */}
          <button
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TopRated;
