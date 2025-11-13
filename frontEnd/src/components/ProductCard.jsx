import {React, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating.jsx";
import { addToCart } from "../slices/cartSlice.js";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../constants";

const ProductCard = ({ product }) => {
	const quantity = 1;
	const [selectedImage, setSelectedImage] = useState();
	const price = product.min_price;
	const addToCartHandler = () => {
		// Add default size and grind when adding from product card
		dispatch(addToCart({ 
			...product, 
			quantity, 
			price,
			size: "250", // Default size
			grind: "whole beans", // Default grind
			roast: product.category === "Subscription" ? "medium" : null, // Default roast for subscriptions
		}));
		// navigate('/cart')
	};
	const dispatch = useDispatch();
	// console.log(product);

	useEffect(() => {
		if (product) {
			setSelectedImage(Array.isArray(product.image) ? product.image[0] : undefined);
		}
	}, [product]);

	return (
		<div className="group relative p-5 w-fit flex flex-col items-center gap-4 bg-white border border-transparent shadow rounded-xl transition-transform ease-out duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-green-200">
			<Link to={`/product/${product.id}`} className="flex flex-col items-center gap-3">
					{selectedImage && (
						<img
						src={product.image ? `${BASE_URL}${selectedImage}` : ""}
						alt="coffee"
						className="w-70 h-48 object-contain transition-transform duration-300 ease-out group-hover:scale-105"
					/>
					)}
				<div className="flex flex-col items-center gap-3 mt-2">
					<p className="text-lg font-[Poppins]">{product.product_name}</p>
					<p className="text-base text-gray-600 font-[Poppins]">
						{product.category}
					</p>
					<p className="text-lg text-green-800 font-bold">
						Rs {product.min_price} - Rs {product.max_price}
					</p>
					<Rating
						value={product.rating}
						text={`${(product.num_reviews ?? product.numReviews ?? (Array.isArray(product.reviews) ? product.reviews.length : 0))} reviews`}
					/>
				</div>
			</Link>
			<button
				onClick={addToCartHandler}
				className="px-5 py-3 bg-green-800 font-[Poppins] w-[80%] text-white font-bold rounded-lg transition-colors duration-300 hover:bg-green-700 hover:cursor-pointer"
			>
				Add to Cart
			</button>
		</div>
	);
};

export default ProductCard;
