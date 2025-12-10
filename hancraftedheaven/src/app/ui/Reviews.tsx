import { Review } from "../lib/definitions";
import { StarIcon } from "@heroicons/react/16/solid";
import { Session } from "next-auth";
import Link from "next/link";
import { ReviewTrigger } from "./ReviewTrigger";
import AverageRating from "./catalog/RateAverage";

type Props = {
  reviews: Review[];
  authenticated: Session | null;
  product_id: string;
};

export default function ReviewCard({
  reviews,
  authenticated,
  product_id,
}: Props) {
  const hasReviews = Array.isArray(reviews) && reviews.length > 0;

  return (
    <section className="w-full max-w-5xl mx-auto rounded-2xl border border-black/20 bg-[#F4EDE4] overflow-hidden">
      <div className="px-5 py-3 border-b border-black/20">
        <AverageRating product_id={product_id} />
      </div>

      {hasReviews ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
          {reviews.map((review) => {
            const reviewDate = new Date(review.created_at);
            return (
              <article
                key={review.review_id}
                className="relative rounded-2xl border border-black/20 bg-white/60 p-4"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-3 bottom-3 w-1.5 rounded-full"
                  style={{ backgroundColor: "#c49b63" }}
                />
                <div className="pl-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-[#1f2937]">
                      {review.firstname} {review.lastname}
                    </p>
                    <time className="text-sm text-gray-500">
                      {reviewDate.toLocaleDateString()}
                    </time>
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: Number(review.rating) || 0 }).map(
                      (_, idx) => (
                        <StarIcon key={idx} className="w-5 h-5" />
                      )
                    )}
                  </div>

                  {review.review ? (
                    <p className="mt-3 text-[#1f2937] break-words">
                      {review.review}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="p-5 text-[#1f2937]">
          No reviews :c, Be the first one to review!
        </div>
      )}

      <div className="px-5 py-4 border-t border-black/20">
        {authenticated?.user ? (
          <ReviewTrigger
            user_id={authenticated.user.id}
            product_id={product_id}
          />
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-56 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Log in to leave a review
          </Link>
        )}
      </div>
    </section>
  );
}
