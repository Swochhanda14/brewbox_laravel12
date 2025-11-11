import { useEffect, useMemo, useState } from "react";
import Banner from "../components/Banner";
import ProductCard from "../components/ProductCard";
import { useParams } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productApiSlice";
import Paginate from "../components/Paginate.jsx";

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

  useEffect(() => {
    setMinPrice(priceStats.min);
    setMaxPrice(priceStats.max);
  }, [priceStats.min, priceStats.max]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
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
  }, [
    products,
    selectedCategory,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    priceStats.min,
    priceStats.max,
  ]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setMinPrice(priceStats.min);
    setMaxPrice(priceStats.max);
    setMinRating(0);
    setInStockOnly(false);
  };

  return (
    <div>
      <Banner title={props.title} />
      {isLoading ? (
        <div>
          <h1>Loading...</h1>
        </div>
      ) : error ? (
        <div>
          {typeof error === "string"
            ? error
            : error?.data?.message || error?.error || JSON.stringify(error)}
        </div>
      ) : products.length === 0 ? (
        <div>
          <h1>No Products Found...</h1>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 px-4 sm:px-6 md:px-10 lg:px-16 py-6">
            <aside className="md:w-64 bg-white shadow-md rounded-lg p-4 h-fit sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Reset
                </button>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="all">All</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Price Range (Rs.)
                </p>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={minPrice}
                    min={priceStats.min}
                    max={priceStats.max}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-1/2 border rounded px-2 py-1 text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    min={priceStats.min}
                    max={priceStats.max}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-1/2 border rounded px-2 py-1 text-sm"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Range: {priceStats.min.toFixed(2)} -{" "}
                  {priceStats.max.toFixed(2)}
                </p>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Minimum Rating
                </label>
                <select
                  id="rating"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value={0}>All ratings</option>
                  <option value={4}>4 ★ & up</option>
                  <option value={3}>3 ★ & up</option>
                  <option value={2}>2 ★ & up</option>
                  <option value={1}>1 ★ & up</option>
                </select>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <input
                  id="stock"
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="h-4 w-4"
                />
                <label
                  htmlFor="stock"
                  className="text-sm font-medium text-gray-600"
                >
                  In stock only
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Showing {filteredProducts.length} of {products.length} results
              </p>
            </aside>

            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      product={product}
                      key={product.id ?? product._id}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-600 py-10 border rounded">
                    No products match the selected filters.
                  </div>
                )}
              </div>
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
