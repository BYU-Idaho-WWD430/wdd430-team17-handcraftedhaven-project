"use client"; // If it has any interactivity, otherwise not strictly needed but good practice for UI components.

import Image from "next/image";

type RateAverageProps = {
  averageRating: string;
  reviewCount: number;
};

export default function RateAverage({ averageRating, reviewCount }: RateAverageProps) {
  // Your component's JSX to display the rating and count
  return (
    <div>
      <span>
        <Image src="/icons/star.svg" width={16} height={16} alt="Star" />
        {averageRating}
      </span>
      <span>({reviewCount} reviews)</span>
    </div>
  );
}