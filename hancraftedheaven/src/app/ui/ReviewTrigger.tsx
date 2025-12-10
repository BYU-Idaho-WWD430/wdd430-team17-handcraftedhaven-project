"use client";

import { useState } from "react";
import { ReviewModal } from "./ReviewModal";

export function ReviewTrigger({
  user_id,
  product_id,
}: {
  user_id: string;
  product_id: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer"
      >
        Leave a Review
      </button>

      {isModalOpen && (
        <ReviewModal
          user_id={user_id}
          product_id={product_id}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
