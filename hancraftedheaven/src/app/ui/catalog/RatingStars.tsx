
import { StarIcon } from '@heroicons/react/24/solid';

interface Props {
  rating: number;
  className?: string;
}

export default function RatingStars({ rating, className = '' }: Props) {
  // Total amount of stars displayed in the rating component
  const totalStars = 5;

  return (
    // Wrapper that allows optional custom styling via className
    <div className={`flex items-center ${className}`}>
      {[...Array(totalStars)].map((_, index) => {
        const starNumber = index + 1;
        return (
          <StarIcon
            key={starNumber}
            className={`h-5 w-5 ${starNumber <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        );
      })}
    </div>
  );
}