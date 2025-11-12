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
import Recommended from "../components/Recommended.jsx";
import { BASE_URL } from "../constants";
import { FaSpinner, FaTimes, FaShoppingCart, FaFilter, FaStar, FaCheckCircle, FaBell, FaUser, FaCalendarAlt } from "react-icons/fa";

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
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-20">
					<FaSpinner className="text-5xl text-green-700 animate-spin mb-4" />
					<h2 className="text-2xl font-semibold text-gray-700">Loading Product...</h2>
				</div>
			) : error ? (
				<div className="max-w-2xl mx-auto px-4 py-12">
					<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
						<FaTimes className="text-4xl text-red-500 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Product</h2>
						<p className="text-red-600">{error.data?.message || error.error || "Unable to load product details"}</p>
					</div>
				</div>
			) : (
				<>
					<div className="flex flex-col justify-center items-center">
						{product ? (
							<div className="w-full">
								<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
									<div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
										{/* === Main Image + Gallery === */}
										<div className="w-full lg:w-[50%]">
											<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 mb-4">
												{selectedImage && (
													<div className="relative overflow-hidden rounded-xl mb-4 bg-gray-50">
														<img
															src={`${BASE_URL}${selectedImage}`}
															alt="product"
															className="w-full h-64 sm:h-80 md:h-[500px] lg:h-[600px] object-contain transition-transform duration-300 hover:scale-105"
														/>
													</div>
												)}

												{/* Image Thumbnails */}
												{product.image && product.image.length > 0 && (
													<div className="flex gap-3 flex-wrap justify-center">
														{product.image.map((img, idx) => (
															<button
																key={idx}
																onClick={() => setSelectedImage(img)}
																className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
																	selectedImage === img
																		? "ring-4 ring-green-500 border-green-500 shadow-lg scale-105"
																		: "border-gray-200 hover:border-green-300 hover:shadow-md"
																}`}
															>
																<img
																	src={`${BASE_URL}${img}`}
																	alt={`thumb-${idx}`}
																	className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
																/>
															</button>
														))}
													</div>
												)}
											</div>
										</div>

										{/* === Product Info === */}
										<div className="w-full lg:w-[50%] flex flex-col">
											<BreadCrumb product={product} />
											<div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
												<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 sm:mt-6 text-gray-800 leading-tight">
													{product.product_name}
												</h1>
												<div className="mt-4 flex items-center gap-4">
													<div className="text-2xl sm:text-3xl font-bold text-green-700">
														Rs {product.min_price} - Rs {product.max_price}
													</div>
												</div>
												<div className="mt-4">
													<Rating
														value={product.rating}
														text={`${(product.num_reviews ?? product.numReviews ?? ((Array.isArray(product.reviews) ? product.reviews.length : 0)))} reviews`}
													/>
												</div>
												<p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed">
													{product.description}
												</p>

												<div className="mt-8 space-y-6 border-t border-gray-200 pt-6">
													<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
														<label className="text-base sm:text-lg font-semibold text-gray-700 min-w-[80px]">Size:</label>
														<select
															onChange={(e) => setSize(e.target.value)}
															className="w-full sm:w-64 p-3 border border-gray-300 rounded-lg text-base bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
														>
															<option value="250">250gm</option>
															<option value="500">500gm</option>
														</select>
													</div>
													{product.category === "Subscription" && (
														<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
															<label className="text-base sm:text-lg font-semibold text-gray-700 min-w-[80px]">Roast:</label>
															<select 
																onChange={(e) => setRoast(e.target.value)} 
																className="w-full sm:w-64 p-3 border border-gray-300 rounded-lg text-base bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
															>
																<option value="medium">Medium</option>
																<option value="medium-dark">Medium-Dark</option>
															</select>
														</div>
													)}
													<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
														<label className="text-base sm:text-lg font-semibold text-gray-700 min-w-[80px]">Grind:</label>
														<select 
															onChange={(e) => setGrind(e.target.value)} 
															className="w-full sm:w-64 p-3 border border-gray-300 rounded-lg text-base bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
														>
															<option value="whole beans">Whole Beans</option>
															<option value="standard medium">Standard Medium</option>
															<option value="french press">French Press</option>
															<option value="pour over">Pour Over</option>
															<option value="home espresso">Home Espresso</option>
														</select>
													</div>
													<div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
														<p className="text-sm text-gray-600 mb-1">Selected Price</p>
														<p className="text-2xl sm:text-3xl font-bold text-green-700">
															Rs {price}
														</p>
													</div>
													<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
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
															className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white font-bold text-base sm:text-lg rounded-lg hover:from-green-800 hover:to-green-900 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
														>
															<FaShoppingCart />
															ADD TO CART
														</button>
													</div>
													{product.countInStock !== undefined && (
														<div className="flex items-center gap-2 text-base text-gray-700">
															<FaCheckCircle className="text-green-600" />
															<span>In stock: <span className="font-semibold text-green-700">{product.countInStock}</span></span>
														</div>
													)}

													{product.countInStock !== undefined && product.countInStock <= 0 && (
														<div className="mt-6 border-2 border-yellow-200 rounded-xl p-6 bg-gradient-to-br from-yellow-50 to-white">
															<div className="flex items-center gap-3 mb-3">
																<FaBell className="text-2xl text-yellow-600" />
																<h3 className="text-xl font-bold text-gray-800">
																	Product out of stock
																</h3>
															</div>
															<p className="text-gray-600 mb-4">
																Leave your email and we&rsquo;ll let you know as soon as it&rsquo;s back.
															</p>
															{notifySuccess ? (
																<div className="flex items-center gap-2 text-green-700 font-semibold p-3 bg-green-50 rounded-lg border border-green-200">
																	<FaCheckCircle />
																	You&apos;re on the list! We&rsquo;ll notify you.
																</div>
															) : (
																<form className="flex flex-col sm:flex-row gap-3" onSubmit={requestStockAlert}>
																	<input
																		type="email"
																		value={notifyEmail}
																		onChange={(e) => setNotifyEmail(e.target.value)}
																		placeholder="you@example.com"
																		className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 hover:bg-white transition-all"
																		required
																	/>
																	<button
																		type="submit"
																		disabled={notifying}
																		className="px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 disabled:opacity-60 transition-all duration-300 flex items-center justify-center gap-2"
																	>
																		{notifying ? <FaSpinner className="animate-spin" /> : <FaBell />}
																		{notifying ? "Submitting..." : "Notify Me"}
																	</button>
																</form>
															)}
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* === Reviews Section === */}
								<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
									<div className="w-full lg:w-3/4 mx-auto">
										<div className="mb-8">
											<h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
												<FaStar className="text-green-700" />
												Customer Reviews
											</h2>
											<p className="text-gray-600">
												{product.reviews?.length || 0} {product.reviews?.length === 1 ? 'review' : 'reviews'}
											</p>
										</div>

										{(!product.reviews || product.reviews.length === 0) && (
											<div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center mb-6">
												<FaStar className="text-4xl text-yellow-500 mx-auto mb-3" />
												<p className="text-lg font-semibold text-yellow-800">No Reviews Yet</p>
												<p className="text-yellow-700 mt-2">Be the first to review this product!</p>
											</div>
										)}

										<div className="space-y-6">
											{/* Review Filters */}
											{(product.reviews && product.reviews.length > 0) && (
												<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
													<div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
														<div className="flex flex-wrap gap-4">
															<div>
																<label className="text-sm font-semibold text-gray-700 block mb-2 flex items-center gap-2">
																	<FaFilter className="text-green-700" />
																	Filter by rating
																</label>
																<select
																	value={activeReviewFilters.rating}
																	onChange={(e) =>
																		setActiveReviewFilters((prev) => ({
																			...prev,
																			rating: e.target.value,
																		}))
																	}
																	className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
																	<label className="text-sm font-semibold text-gray-700 block mb-2">Keyword</label>
																	<select
																		value={activeReviewFilters.keyword}
																		onChange={(e) =>
																			setActiveReviewFilters((prev) => ({
																				...prev,
																				keyword: e.target.value,
																			}))
																		}
																		className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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
															className="text-sm text-green-700 hover:text-green-800 font-semibold hover:underline self-start sm:self-auto px-4 py-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
														>
															Clear filters
														</button>
													</div>
												</div>
											)}

											{/* Review Cards */}
											{filteredReviews.map((review, idx) => (
												<div
													key={review.id ?? review._id ?? idx}
													className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 sm:p-6 hover:shadow-xl transition-shadow duration-300"
												>
													<div className="flex items-start justify-between mb-3">
														<div className="flex items-center gap-3">
															<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
																<FaUser className="text-green-700" />
															</div>
															<div>
																<strong className="block text-lg font-semibold text-gray-800">{review.name}</strong>
																<div className="mt-1">
																	<Rating value={review.rating} />
																</div>
															</div>
														</div>
														<div className="flex items-center gap-2 text-sm text-gray-500">
															<FaCalendarAlt />
															<span>{(review.created_at ?? review.createdAt ?? '').toString().substring(0, 10)}</span>
														</div>
													</div>
													<p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
													{Array.isArray(review.keywords) && review.keywords.length > 0 && (
														<div className="flex flex-wrap gap-2">
															{review.keywords.map((kw) => (
																<span
																	key={kw}
																	className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200"
																>
																	#{kw}
																</span>
															))}
														</div>
													)}
												</div>
											))}
											{filteredReviews.length === 0 && product.reviews && product.reviews.length > 0 && (
												<div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
													<p className="text-gray-600 font-medium">No reviews match the selected filters yet.</p>
												</div>
											)}

											{/* Write Review Form */}
											<div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 sm:p-8">
												<h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
													<FaStar className="text-green-700" />
													Write a Customer Review
												</h2>
												{loadingReview && (
													<div className="flex items-center justify-center gap-2 text-green-700 mb-4">
														<FaSpinner className="animate-spin" />
														<span>Submitting review...</span>
													</div>
												)}
												{userInfo ? (
													<form onSubmit={submitHandler} className="space-y-6">
														<div>
															<label
																htmlFor="rating"
																className="block mb-3 text-base font-semibold text-gray-700"
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
																className="block mb-2 text-base font-semibold text-gray-700"
															>
																Comment
															</label>
															<textarea
																id="comment"
																required
																rows="4"
																className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-gray-50 hover:bg-white resize-none"
																value={review}
																onChange={(e) => setReview(e.target.value)}
																placeholder="Share your thoughts about this product..."
															></textarea>
														</div>
														<button
															type="submit"
															disabled={loadingReview}
															className="px-8 py-3 bg-gradient-to-r from-green-700 to-green-800 text-white font-semibold rounded-lg hover:from-green-800 hover:to-green-900 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
														>
															{loadingReview ? "Submitting..." : "Submit Review"}
														</button>
													</form>
												) : (
													<div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
														<p className="text-blue-800 text-lg mb-3">
															Please{" "}
															<Link
																to="/login"
																className="text-blue-600 underline font-semibold hover:text-blue-700"
															>
																sign in
															</Link>{" "}
															to write a review
														</p>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* === Recommended === */}
								<div className="mt-12 sm:mt-16 border-t border-gray-300 pt-8 sm:pt-12">
									<Recommended userId={userId} />
								</div>

								{/* === Recently Viewed === */}
								{recentProducts.length > 0 && (
									<div className="w-full border-t border-gray-300 mt-12 sm:mt-16 pt-8 sm:pt-12">
										<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
											<div className="flex flex-col items-center mb-8 sm:mb-12">
												<h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
													Recently <span className="text-green-700">Viewed</span>
												</h2>
												<span className="h-1 w-24 sm:w-32 bg-green-700 rounded"></span>
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
												{recentProducts.map((item) => (
													<Link
														key={item.id}
														to={`/product/${item.id}`}
														className="group relative bg-white border border-gray-200 rounded-xl p-5 sm:p-6 flex flex-col hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out hover:border-green-300"
													>
														{item.image && (
															<div className="overflow-hidden rounded-lg mb-4 bg-gray-50">
																<img
																	src={`${BASE_URL}${item.image}`}
																	alt={item.name}
																	className="w-full h-40 sm:h-48 object-contain group-hover:scale-110 transition-transform duration-300 ease-out"
																/>
															</div>
														)}
														<div className="text-base sm:text-lg text-gray-800 font-semibold mb-2 line-clamp-2">
															{item.name}
														</div>
														<div className="text-base sm:text-lg text-green-700 font-bold mt-auto">
															{item.priceRange}
														</div>
													</Link>
												))}
											</div>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="max-w-2xl mx-auto px-4 py-12">
								<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
									<FaTimes className="text-5xl text-gray-400 mx-auto mb-4" />
									<h1 className="text-2xl font-bold text-gray-800 mb-2">No Product Found</h1>
									<p className="text-gray-600">The product you're looking for doesn't exist.</p>
								</div>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default ProductDetails;
