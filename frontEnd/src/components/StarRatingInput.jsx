import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRatingInput = ({ rating, setRating }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="text-yellow-400 hover:text-yellow-500 focus:outline-none"
        >
          <FaStar className={star <= rating ? 'fill-current' : 'text-gray-300 hover:text-yellow-400'} />
        </button>
      ))}
    </div>
  );
};

export default StarRatingInput;