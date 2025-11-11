import React from "react";

const Banner = (props) => {
	return (
		<div className="relative h-28 sm:h-36 md:h-40 flex items-center justify-center bg-green-900">
			<div
				className="absolute inset-0 bg-cover bg-center opacity-10"
				style={{ backgroundImage: "url('/bannerbg.jpg')" }}
			></div>
			<p className="relative text-white font-bold text-2xl sm:text-3xl md:text-4xl uppercase text-center px-2">{props.title}</p>
		</div>
	);
};

export default Banner;
