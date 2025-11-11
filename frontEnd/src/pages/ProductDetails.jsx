import { React, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb.jsx";
import QuantitySelector from "../components/QuantitySelector.jsx";
import Rating from "../components/Rating.jsx";
import {
	useGetProductDetailsQuery,
	useCreateReviewMutation,
  useNotifyWhenBackInStockMutation,
} from "../slices/productApiSlice.js";
import { addToCart } from "../slices/cartSlice.js";
import { useDispatch, useSelector } from "react-redux";
import StarRatingInput from "../components/StarRatingInput.jsx";
import { toast } from "react-toastify";
// import TopRated from "../components/TopRated.jsx";
import Recommended from "../components/Recommended.jsx";
import { BASE_URL } from "../constants";

const ProductDetails = () => {
	const [price, setPrice] = useState(0);
	const [size, setSize] = useState("250");
	const [grind, setGrind] = useState("whole beans");
	const [roast, setRoast] = useState("medium");
	const [quantity, setQuantity] = useState(1);
	const [rating, setRating] = useState(0);
	const [review, setReview] = useState("");
	const [selectedImage, setSelectedImage] = useState();

	 const userLogin = useSelector((state) => state.auth)
  	const userId = userLogin?.userInfo?._id

	const { id: productId } = useParams();
	const dispatch = useDispatch();
	// const navigate = useNavigate();

	const {
		data: product,
		isLoading,
		error,
		refetch,
	} = useGetProductDetailsQuery(productId);
	const [recentProducts, setRecentProducts] = useState([]);

	const [createReview, { isLoading: loadingReview }] =
		useCreateReviewMutation();
  const [notifyWhenBackInStock, { isLoading: notifying }] =
    useNotifyWhenBackInStockMutation();

	const { userInfo } = useSelector((state) => state.auth);
  const defaultEmail = userInfo?.email ?? "";
  const [notifyEmail, setNotifyEmail] = useState(defaultEmail);
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Add these state variables after your existing useState declarations
const [activeReviewFilters, setActiveReviewFilters] = useState({
	rating: "all",
	keyword: "all"
  });
  
  // Add these computed values using useMemo
  const uniqueRatingOptions = useMemo(() => {
	if (!product?.reviews) return [];
	const ratings = [...new Set(product.reviews.map(r => r.rating))];
	return ratings.sort((a, b) => b - a);
  }, [product?.reviews]);
  
  const allKeywords = useMemo(() => {
	if (!product?.reviews) return [];
	const keywords = new Set();
	product.reviews.forEach(review => {
	  if (Array.isArray(review.keywords)) {
		review.keywords.forEach(kw => keywords.add(kw));
	  }
	});
	return Array.from(keywords).sort();
  }, [product?.reviews]);
  
  const filteredReviews = useMemo(() => {
	if (!product?.reviews) return [];
	
	return product.reviews.filter(review => {
	  // Filter by rating
	  if (activeReviewFilters.rating !== "all" && 
		  review.rating !== Number(activeReviewFilters.rating)) {
		return false;
	  }
	  
	  // Filter by keyword
	  if (activeReviewFilters.keyword !== "all" && 
		  (!Array.isArray(review.keywords) || 
		   !review.keywords.includes(activeReviewFilters.keyword))) {
		return false;
	  }
	  
	  return true;
	});
  }, [product?.reviews, activeReviewFilters]);

  useEffect(() => {
    setNotifyEmail(defaultEmail);
  }, [defaultEmail]);
	// setRoast(product.roast); 
	useEffect(() => {
		if (product) {
			setPrice(size === "250" ? product.min_price : product.max_price);
			setSelectedImage(product.image[0]); 
			// Default roast if not provided
			// Default main image
			// console.log(product.image[0]);
		}
	}, [size, product]);

	useEffect(() => {
		if (!product || !productId) return;

		const storageKey = "recentProducts";
		const stored = (() => {
			try {
				const raw = localStorage.getItem(storageKey);
				return raw ? JSON.parse(raw) : [];
			} catch (err) {
				console.error("Failed to parse recent products", err);
				return [];
			}
		})();

		const filtered = Array.isArray(stored)
			? stored.filter((item) => item.id !== productId)
			: [];

		const productSummary = {
			id: productId,
			name: product.product_name,
			image: Array.isArray(product.image) ? product.image[0] : product.image,
			priceRange: product.min_price
				? `Rs. ${product.min_price} - Rs. ${product.max_price}`
				: `Rs. ${product.price ?? ""}`,
		};

		const updated = [productSummary, ...filtered].slice(0, 6);

		try {
			localStorage.setItem(storageKey, JSON.stringify(updated));
		} catch (err) {
			console.error("Failed to save recent products", err);
		}
		setRecentProducts(updated.slice(1));
	}, [product, productId]);

	useEffect(() => {
		if (product?.product_name) {
			document.title = `${product.product_name} | BrewBox`;
		}
		return () => {
			document.title = "BrewBox";
		};
	}, [product]);

	const addToCartHandler = () => {
		if (product.countInStock !== undefined && quantity > product.countInStock) {
			toast.error(`Cannot add more than available stock (${product.countInStock})`);
			return;
		}
		dispatch(addToCart({ ...product, quantity, price, size, grind, roast }));
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			await createReview({
				productId,
				rating,
				comment: review,
			}).unwrap();
			refetch();
			toast.success("Review submitted successfully");
			setRating(0);
			setReview("");
		} catch (error) {
			toast.error(error?.data?.message || error.error);
		}
	};

  const requestStockAlert = async (e) => {
    e.preventDefault();
    if (!notifyEmail) {
      toast.error("Please enter an email address.");
      return;
    }
    try {
      await notifyWhenBackInStock({ productId, email: notifyEmail }).unwrap();
      setNotifySuccess(true);
      toast.success("We will notify you when this product is back in stock.");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Unable to register for alerts.");
    }
  };

	return (
		<>
			{isLoading ? (
				<div>Loading...</div>
			) : error ? (
				<div>{error.data.message || error.error}</div>
			) : (
				<>
					<div className="flex flex-col justify-center items-center">
						{product ? (
							<div className="">
								<div className="p-5 sm:my-10 sm:mx-6 md:mx-30 flex flex-col md:flex-row gap-6 md:gap-10 w-full md:w-[81%]">
									{/* === Main Image + Gallery === */}
									<div className="w-full md:w-[50%]">
										{selectedImage && (
											<img
												src={`${BASE_URL}${selectedImage}`}
												alt="product"
												className="w-full h-60 sm:h-80 md:h-[600px] object-cover border border-gray-100 rounded mb-4"
											/>
										)}

										{/* Image Thumbnails */}
										{product.image && product.image.length > 0 && (
											<div className="flex gap-2 sm:gap-3 flex-wrap">
												{product.image.map((img, idx) => (
													<img
														key={idx}
														src={`${BASE_URL}${img}`}
														alt={`thumb-${idx}`}
														className={`w-14 h-14 sm:w-20 sm:h-20 object-cover border rounded cursor-pointer ${
															selectedImage === img
																? "ring-2 ring-green-600"
																: ""
														}`}
														onClick={() => setSelectedImage(img)}
													/>
												))}
											</div>
										)}
									</div>

									{/* === Product Info === */}
									<div className="w-full md:w-[50%] flex flex-col ">
										<BreadCrumb product={product} />
										<h1 className="text-2xl sm:text-3xl font-semibold mt-4 sm:mt-8 font-[Helvetica] text-gray-800">
											{product.product_name}
										</h1>
										<h1 className="text-xl sm:text-2xl font-semibold text-green-800 mt-3 sm:mt-5">
											Rs {product.min_price} - Rs {product.max_price}
										</h1>
										<div className="mt-2">
											<Rating
												value={product.rating}
												text={`${(product.num_reviews ?? product.numReviews ?? ((Array.isArray(product.reviews) ? product.reviews.length : 0)))} reviews`}
											/>
										</div>
										<p className="mt-4 sm:mt-8 text-base sm:text-lg text-gray-600 text-justify">
											{product.description}
										</p>
										<div className="mt-6 sm:mt-10">
											<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10">
												<p className="text-lg sm:text-xl font-semibold">Size: </p>
												<select
													onChange={(e) => setSize(e.target.value)}
													className="w-full sm:w-52 p-2 border border-gray-500 rounded text-base sm:text-lg text-gray-600"
												>
													<option value="250">250gm</option>
													<option value="500">500gm</option>
												</select>
											</div>
											{product.category === "Subscription" && (
												<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-7 mt-4 sm:mt-5">
													<p className="text-lg sm:text-xl font-semibold">Roast: </p>
													<select onChange={(e) => setRoast(e.target.value)} className="w-full sm:w-52 p-2 border border-gray-500 rounded text-base sm:text-lg text-gray-600">
														<option value="medium">Medium</option>
														<option value="medium-dark">Medium-Dark</option>
													</select>
												</div>
											)}
											<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-7 mt-4 sm:mt-5">
												<p className="text-lg sm:text-xl font-semibold">Grind: </p>
												<select onChange={(e) => setGrind(e.target.value)} className="w-full sm:w-52 p-2 border border-gray-500 rounded text-base sm:text-lg text-gray-600">
													<option value="whole beans">Whole Beans</option>
													<option value="standard medium">
														Standard Medium
													</option>
													<option value="french press">French Press</option>
													<option value="pour over">Pour Over</option>
													<option value="home espresso">Home Espresso</option>
												</select>
											</div>
											<div className="mt-4 sm:mt-5">
												<p className="text-xl sm:text-2xl font-bold text-green-800">
													Rs {price}
												</p>
											</div>
											<div className="mt-4 sm:mt-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
												<QuantitySelector
													quantity={quantity}
													setQuantity={val => {
														if (product.countInStock !== undefined && val > product.countInStock) {
															setQuantity(product.countInStock);
															toast.error(`Cannot select more than available stock (${product.countInStock})`);
														} else {
															setQuantity(val);
														}
													}}
												/>
												<button
													onClick={addToCartHandler}
													className="bg-green-800 text-white font-bold text-base sm:text-lg p-2 hover:cursor-pointer"
												>
													ADD TO CART
												</button>
												{product.countInStock !== undefined && (
													<span className="ml-0 sm:ml-4 mt-2 sm:mt-0 text-lg text-gray-600">In stock: <span className="font-semibold">{product.countInStock}</span></span>
												)}
											</div>

                      {product.countInStock !== undefined && product.countInStock <= 0 && (
                        <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50 w-full md:w-3/4">
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Product out of stock
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            Leave your email and we&rsquo;ll let you know as soon as it&rsquo;s back.
                          </p>
                          {notifySuccess ? (
                            <div className="text-green-700 font-medium">
                              You&apos;re on the list! We&rsquo;ll notify you.
                            </div>
                          ) : (
                            <form className="flex flex-col sm:flex-row gap-3" onSubmit={requestStockAlert}>
                              <input
                                type="email"
                                value={notifyEmail}
                                onChange={(e) => setNotifyEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="flex-1 border rounded px-3 py-2 text-sm"
                                required
                              />
                              <button
                                type="submit"
                                disabled={notifying}
                                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
                              >
                                {notifying ? "Submitting..." : "Notify Me"}
                              </button>
                            </form>
                          )}
                        </div>
                      )}
										</div>
									</div>
								</div>

								{/* === Reviews Section === */}
								<div className="flex flex-col items-center w-full md:w-[100%]">
									<div className="w-full md:w-1/2 p-2 sm:p-4">
										<h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Reviews</h2>
										{(!product.reviews || product.reviews.length === 0) && (
											<div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4">
												No Reviews
											</div>
										)}
										<div className="space-y-4">
											<div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-gray-50 border border-gray-200 rounded-md p-3 sm:p-4">
												<div className="flex gap-3">
													<div>
														<label className="text-sm font-medium text-gray-600 block">Filter by rating</label>
														<select
															value={activeReviewFilters.rating}
															onChange={(e) =>
																setActiveReviewFilters((prev) => ({
																	...prev,
																	rating: e.target.value,
																}))
															}
															className="mt-1 border rounded px-2 py-1 text-sm"
														>
															<option value="all">All ratings</option>
															{uniqueRatingOptions.map((ratingOption) => (
																<option key={ratingOption} value={ratingOption}>
																	{ratingOption} ★
																</option>
															))}
														</select>
													</div>
													{allKeywords.length > 0 && (
														<div>
															<label className="text-sm font-medium text-gray-600 block">Keyword</label>
															<select
																value={activeReviewFilters.keyword}
																onChange={(e) =>
																	setActiveReviewFilters((prev) => ({
																		...prev,
																		keyword: e.target.value,
																	}))
																}
																className="mt-1 border rounded px-2 py-1 text-sm"
															>
																<option value="all">All</option>
																{allKeywords.map((keyword) => (
																	<option key={keyword} value={keyword}>
																		{keyword}
																	</option>
																))}
															</select>
														</div>
													)}
												</div>
												<button
													onClick={() =>
														setActiveReviewFilters({ rating: "all", keyword: "all" })
													}
													className="text-sm text-blue-600 hover:underline self-start sm:self-auto"
												>
													Clear filters
												</button>
											</div>

											{filteredReviews.map((review, idx) => (
												<div
													key={review.id ?? review._id ?? idx}
													className="border border-gray-200 p-3 sm:p-4 rounded shadow-sm"
												>
													<div className="flex items-center mb-2 justify-between">
														<strong className="block">{review.name}</strong>
														<p className="text-xs sm:text-sm text-gray-500">
															{(review.created_at ?? review.createdAt ?? '').toString().substring(0, 10)}
														</p>
													</div>
													<Rating value={review.rating} />
													<p>{review.comment}</p>
													{Array.isArray(review.keywords) && review.keywords.length > 0 && (
														<div className="flex flex-wrap gap-2 mt-3">
															{review.keywords.map((kw) => (
																<span
																	key={kw}
																	className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700"
																>
																	#{kw}
																</span>
															))}
														</div>
													)}
												</div>
											))}
											{filteredReviews.length === 0 && (
												<div className="bg-gray-50 border border-gray-200 p-3 rounded text-sm text-gray-600">
													No reviews match the selected filters yet.
												</div>
											)}
											<div className="border border-gray-300 p-3 sm:p-4 rounded shadow-sm">
												<h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">
													Write a Customer Review
												</h2>
												{loadingReview && <>Loading...</>}
												{userInfo ? (
													<form onSubmit={submitHandler} className="space-y-3 sm:space-y-4">
														<div>
															<label
																htmlFor="rating"
																className="block mb-1 font-medium"
															>
																Rating
															</label>
															<StarRatingInput
																rating={rating}
																setRating={setRating}
															/>
														</div>
														<div>
															<label
																htmlFor="comment"
																className="block mb-1 font-medium"
															>
																Comment
															</label>
															<textarea
																id="comment"
																required
																rows="3"
																className="w-full border border-gray-300 rounded px-3 py-2"
																value={review}
																onChange={(e) => setReview(e.target.value)}
															></textarea>
														</div>
														<button
															type="submit"
															disabled={loadingReview}
															className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
														>
															Submit
														</button>
													</form>
												) : (
													<div className="bg-blue-100 text-blue-800 p-3 rounded">
														Please{" "}
														<Link
															to="/login"
															className="text-blue-600 underline"
														>
															sign in
														</Link>{" "}
														to write a review
													</div>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* === Recommended === */}
								<div className="mt-10 sm:mt-16 border-t border-gray-300 pt-6 sm:pt-10">
									<Recommended userId={userId} />
								</div>

								{/* === Recently Viewed === */}
								{recentProducts.length > 0 && (
									<div className="mt-10 sm:mt-16 border-t border-gray-300 pt-6 sm:pt-10">
										<h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
											Recently Viewed
										</h2>
										<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
											{recentProducts.map((item) => (
												<Link
													key={item.id}
													to={`/product/${item.id}`}
													className="border rounded-lg p-4 flex flex-col hover:shadow-md transition-shadow bg-white"
												>
													{item.image && (
														<img
															src={`${BASE_URL}${item.image}`}
															alt={item.name}
															className="w-full h-40 object-cover rounded mb-3"
														/>
													)}
													<div className="text-gray-800 font-semibold">
														{item.name}
													</div>
													<div className="text-sm text-gray-600">
														{item.priceRange}
													</div>
												</Link>
											))}
										</div>
									</div>
								)}
							</div>
						) : (
							<div>
								<h1>No product found</h1>
							</div>
						)}
					</div>
				</>
			)}
		</>
	);
};

export default ProductDetails;
