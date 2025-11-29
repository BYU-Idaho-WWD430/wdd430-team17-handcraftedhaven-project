import { fetchProductStats } from "@/app/lib/actions";
import { StarIcon } from "@heroicons/react/16/solid";

type Props = {
  product_id: string;
};

export default async function AverageRating({ product_id }: Props) {
  const stats = await fetchProductStats(product_id);
  return (
    <div className="flex justify-center items-center gap-2 mb-0 border-b py-2">
      <StarIcon className="w-6 h-6 text-yellow-500" />
      <span className="font-bold text-xl">{stats.average_rating}</span>
      <span className="text-gray-600">({stats.review_count} reviews)</span>
    </div>
  );
}
