import { React, useState } from "react";

const QuantitySelector = ({quantity,setQuantity}) => {
	
	return (
		<div>
			<div className="flex items-center">
				<button
					onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
					className="border p-3 hover:cursor-pointer"
					disabled={quantity === 1}
				>
					-
				</button>
				<div className="border border-x-0 p-3">{quantity}</div>
				<button
					onClick={() => setQuantity(quantity + 1)}
					className="border p-3 hover:cursor-pointer"
				>
					+
				</button>
			</div>
		</div>
	);
};

export default QuantitySelector;
