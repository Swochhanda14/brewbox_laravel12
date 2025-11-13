import { useEffect, useMemo, useState } from "react";
import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import { useParams } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productApiSlice";
import Paginate from "../components/Paginate.jsx";
import { FaFilter, FaTimes, FaSpinner, FaSort } from "react-icons/fa";

const ShopPage = (props) => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const products = useMemo(
    () => (Array.isArray(data?.products) ? data.products : []),
    [data]
  );

  const categoryOptions = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const priceStats = useMemo(() => {
    if (!products.length) return { min: 0, max: 0 };
    const prices = products.flatMap((p) => [
      Number(p.min_price ?? p.price ?? 0),
      Number(p.max_price ?? p.price ?? 0),
    ]);
    const filtered = prices.filter((val) => !isNaN(val));
    if (!filtered.length) return { min: 0, max: 0 };
    return {
      min: Math.min(...filtered),
      max: Math.max(...filtered),
    };
  }, [products]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState(priceStats.min);
  const [maxPrice, setMaxPrice] = useState(priceStats.max);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    setMinPrice(priceStats.min);
    setMaxPrice(priceStats.max);
  }, [priceStats.min, priceStats.max]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const categoryPass =
        selectedCategory === "all" || product.category === selectedCategory;

      const productMinPrice = Number(product.min_price ?? product.price ?? 0);
      const productMaxPrice = Number(product.max_price ?? product.price ?? 0);
      const lowerBound = isNaN(minPrice) ? priceStats.min : minPrice;
      const upperBound = isNaN(maxPrice) ? priceStats.max : maxPrice;
      const pricePass =
        (isNaN(productMinPrice) && isNaN(productMaxPrice)) ||
        (productMaxPrice >= lowerBound && productMinPrice <= upperBound);

      const ratingValue = Number(product.rating ?? 0);
      const ratingPass = ratingValue >= minRating;

      const stockCount = Number(
        product.count_in_stock ?? product.countInStock ?? product.stock ?? 0
      );
      const stockPass = !inStockOnly || stockCount > 0;

      return categoryPass && pricePass && ratingPass && stockPass;
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          const aPrice = Number(a.min_price ?? a.price ?? 0);
          const bPrice = Number(b.min_price ?? b.price ?? 0);
          return aPrice - bPrice;
        
        case "price-high":
          const aPriceHigh = Number(a.max_price ?? a.min_price ?? a.price ?? 0);
          const bPriceHigh = Number(b.max_price ?? b.min_price ?? b.price ?? 0);
          return bPriceHigh - aPriceHigh;
        
        case "rating":
          const aRating = Number(a.rating ?? 0);
          const bRating = Number(b.rating ?? 0);
          return bRating - aRating;
        
        case "name-asc":
          return (a.product_name || '').localeCompare(b.product_name || '');
        
        case "name-desc":
          return (b.product_name || '').localeCompare(a.product_name || '');
        
        case "newest":
          const aDate = new Date(a.created_at ?? a.createdAt ?? 0);
          const bDate = new Date(b.created_at ?? b.createdAt ?? 0);
          return bDate - aDate;
        
        default:
          return 0; // Keep original order
      }
    });

    return sorted;
  }, [
    products,
    selectedCategory,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    sortBy,
    priceStats.min,
    priceStats.max,
  ]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setMinPrice(priceStats.min);
    setMaxPrice(priceStats.max);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy("default");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Banner title={props.title} />
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FaSpinner className="text-5xl text-green-700 animate-spin mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">Loading Products...</h2>
          <p className="text-gray-500 mt-2">Please wait while we fetch the best coffee for you</p>
        </div>
      ) : error ? (
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <FaTimes className="text-4xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-red-600">
              {typeof error === "string"
                ? error
                : error?.data?.message || error?.error || "Unable to load products. Please try again later."}
            </p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Products Found</h2>
            <p className="text-lg text-gray-600 mb-6">
              We couldn't find any products matching your criteria. Try adjusting your filters or check back later.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 px-4 sm:px-6 md:px-10 lg:px-16 py-8">
            <aside className="md:w-72 bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 shadow-xl rounded-2xl p-6 h-fit sticky top-24">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-green-700" />
                  <h3 className="text-xl font-bold text-gray-800">
                    Filters
                  </h3>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-sm font-semibold text-green-700 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-lg px-4 py-1.5 bg-green-50 hover:bg-green-100 transition-all duration-300"
                >
                  Reset All
                </button>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="category"
                  className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-300"
                >
                  <option value="all">All Categories</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Price Range (Rs.)
                </p>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    value={minPrice}
                    min={priceStats.min}
                    max={priceStats.max}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-1/2 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-300"
                    placeholder="Min"
                  />
                  <span className="text-gray-500 font-semibold">-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    min={priceStats.min}
                    max={priceStats.max}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-1/2 border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-300"
                    placeholder="Max"
                  />
                </div>
                <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  Range: Rs. {priceStats.min.toFixed(2)} - Rs. {priceStats.max.toFixed(2)}
                </p>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="rating"
                  className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide"
                >
                  Minimum Rating
                </label>
                <select
                  id="rating"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-300"
                >
                  <option value={0}>All ratings</option>
                  <option value={4}>4 ★ & up</option>
                  <option value={3}>3 ★ & up</option>
                  <option value={2}>2 ★ & up</option>
                  <option value={1}>1 ★ & up</option>
                </select>
              </div>

              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
                <input
                  id="stock"
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="h-5 w-5 accent-green-600 cursor-pointer"
                />
                <label
                  htmlFor="stock"
                  className="text-sm font-semibold text-gray-700 cursor-pointer"
                >
                  In stock only
                </label>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <p className="text-sm font-semibold text-green-800 text-center">
                  Showing <span className="text-lg font-bold">{filteredProducts.length}</span> of{" "}
                  <span className="text-lg font-bold">{products.length}</span> products
                </p>
              </div>
            </aside>

            <div className="flex-1">
              {filteredProducts.length > 0 ? (
                <>
                  <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      Our Products
                      <span className="text-green-700 ml-2">({filteredProducts.length})</span>
                    </h2>
                    <div className="flex items-center gap-3">
                      <FaSort className="text-green-700" />
                      <label htmlFor="sort" className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                        Sort by:
                      </label>
                      <select
                        id="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all hover:border-green-300 min-w-[180px]"
                      >
                        <option value="default">Default</option>
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Rating: High to Low</option>
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        product={product}
                        key={product.id ?? product._id}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-200 max-w-md mx-auto">
                    <FaFilter className="text-5xl text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">No Products Match</h3>
                    <p className="text-gray-600 mb-6">
                      No products match the selected filters. Try adjusting your search criteria.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-all duration-300 transform hover:scale-105"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </div>
  );
};

export default ShopPage;
