import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Banner from "../components/Banner";
import { useGetProductsQuery } from "../slices/productApiSlice.js";
import ProductCard from "../components/ProductCard.jsx";

const SubscriptionPage = (props) => {
	const [product, setProduct] = useState([]);
	const { pageNumber, keyword } = useParams();
	
	  const { data, isLoading, error } = useGetProductsQuery({
		keyword,
		pageNumber,
	  });

	useEffect(() => {
		if (data) {
			const subscriptionProducts = Array.isArray(data?.products)
				? data.products.filter((p) => p.category === "Subscription")
				: [];
			setProduct(subscriptionProducts);
		}
	}, [data]);

	return (
		<div>
			<Banner title={props.title} />
			{isLoading ? (
				<div>Loading...</div>
			) : error ? (
				<div>{typeof error === 'string' ? error : error?.data?.message || error?.error || JSON.stringify(error)}</div>
			) : (
				<div className="flex justify-center p-8 sm:p-0">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-4 sm:m-6 md:m-10 gap-4 sm:gap-6 md:gap-10 w-full">
						{product.length > 0 ? (
							product.map((p) => <ProductCard product={p} key={p.id ?? p._id} />)
						) : (
							<p>No Subscription Products Available</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default SubscriptionPage;
