
import React from 'react';

// Component to display a single star rating.
const StarRating = () => {
  return (
    <div className="flex text-pink-500 items-center space-x-1">
      {Array(5).fill().map((_, i) => (
        <i key={`star-${i}`} className="fas fa-star text-xs sm:text-sm"></i>
      ))}
    </div>
  );
};

// Component for a single testimonial card with dynamic styling.
const TestimonialCard = ({ testimonial, isHovered, onMouseEnter, onMouseLeave }) => {
  const cardClasses = `
    relative transition-all duration-300 ease-in-out
    p-4 sm:p-6 rounded-2xl sm:rounded-3xl cursor-pointer
    ${isHovered
      ? 'bg-emerald-700 text-white shadow-xl sm:transform sm:scale-105 sm:z-10'
      : 'bg-emerald-700 text-[#fafafa] shadow-md'
    }
  `;

  return (
    <div
      className={cardClasses}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-col h-full">
        {/* Avatar positioned outside the card */}
        <div className="absolute -top-6 sm:-top-8 left-4 sm:left-6">
          <img
            src={testimonial.avatarUrl}
            alt={testimonial.name}
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full ring-2 sm:ring-4 ring-white object-cover"
          />
        </div>

        {/* Quote section */}
        <p className={`text-xs sm:text-sm mb-4 sm:mb-6 mt-6 sm:mt-8 transition-all duration-300 ${isHovered ? 'text-gray-200' : 'text-[#fafafa]'}`}>
          {testimonial.quote}
        </p>
        
        {/* Name and title */}
        <div className="mt-auto text-[#003825]">
          <p className="font-bold text-sm sm:text-lg">{testimonial.name}</p>
          <p className="text-xs sm:text-sm font-semibold">{testimonial.title}</p>
        </div>
        
        {/* Star rating */}
        <div className="mt-3 sm:mt-4">
          <StarRating />
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;