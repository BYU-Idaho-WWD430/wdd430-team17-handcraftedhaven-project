"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { type ReviewFormState, postNewReview } from "@/app/lib/actions";
import { StarIcon } from "@heroicons/react/16/solid";
import React from "react";

type Props = {
  user_id: string;
  product_id: string;
  onClose: () => void;
};

export function ReviewModal({ user_id, product_id, onClose }: Props) {
  const initialState: ReviewFormState = {
    success: false,
    message: "",
    errors: { _errors: [] },
    submittedData: {},
  };

  const [state, formAction, isPending] = useActionState(
    postNewReview,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success, onClose]);

  return (
    <div className="fixed inset-0 backdrop-blur-xs border-black flex justify-center items-center z-50">
      <div className="border border-black bg-white p-8 rounded-2xl shadow-2xl relative max-w-lg w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-3xl font-light text-red-500 hover:text-red-600 hover:scale-115"
          aria-label="Close modal"
          disabled={isPending}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">Write your review</h2>

        {state.success ? (
          <p className="text-green-600 text-center py-8">{state.message}</p>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="user_id" value={user_id} />
            <input type="hidden" name="product_id" value={product_id} />

            <div>
              <label className="block font-medium mb-1">Rating:</label>
              <div className="flex flex-row-reverse justify-end items-center">
                {[5, 4, 3, 2, 1].map((n) => (
                  <React.Fragment key={n}>
                    <input
                      type="radio"
                      id={`star${n}`}
                      name="rating"
                      value={n}
                      className="peer sr-only"
                      required
                    />
                    <label
                      htmlFor={`star${n}`}
                      className="cursor-pointer text-gray-300 transition-colors peer-hover:text-yellow-400 hover:text-yellow-400 peer-checked:text-yellow-500"
                    >
                      <StarIcon className="w-8 h-8" />
                    </label>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="review-text" className="block font-medium mb-1">
                Review:
              </label>
              <textarea
                id="review-text"
                name="review"
                className="border w-full p-2 rounded"
                rows={4}
                defaultValue={state.submittedData?.review ?? ""}
                required
                placeholder="Leave your review"
              />
              {state.errors?.review && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.review._errors.join(", ")}
                </p>
              )}
            </div>

            {state.message && !state.success && (
              <p className="text-red-500 text-sm">{state.message}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer w-full bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {isPending ? "Posting..." : "Post review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
