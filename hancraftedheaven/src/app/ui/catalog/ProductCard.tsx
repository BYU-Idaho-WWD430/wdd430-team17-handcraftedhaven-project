import Image from "next/image";
import Link from "next/link";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import AverageRating from "./RateAverage";
import { ProductWithSeller } from "../../lib/definitions";

type Props = { product: ProductWithSeller };

export default function ProductCard({ product }: Props) {
  const price =
    typeof product.price === "number"
      ? product.price.toFixed(2)
      : Number(product.price).toFixed(2);

  return (
    <article
      className="
        w-64 rounded-2xl shadow-md border-4 border-[#c49b63]
        bg-[#fdf8f3] flex flex-col overflow-hidden
      "
    >
      <div className="relative">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
        <span
          className="
            absolute bottom-2 right-2
            bg-white/90 text-[#5b362e] text-xs font-semibold
            px-3 py-1 rounded-full shadow-sm border border-[#e5e5e5]
          "
        >
          {product.category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-[#3e2723] text-center">
            {product.name}
          </h3>
          <p className="text-sm text-gray-700 text-center mt-1 min-h-[48px]">
            {product.description}
          </p>
        </div>

        <div className="mt-2">
          <div className="flex justify-center">
            <AverageRating product_id={product.product_id} />
          </div>
          <Link
            href={`/profiles/${product.user_id}`}
            className="text-xs text-blue-600 hover:underline text-center mt-1 block"
          >
            By: {product.seller_firstname} {product.seller_lastname} (
            {product.seller_category})
          </Link>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 font-bold text-green-700">
            <CurrencyDollarIcon className="w-5 h-5" />
            {price}
          </span>
          <Link
            href={`/list/${product.product_id}`}
            className="
              inline-flex items-center justify-center
              bg-[#1f2937] text-white
              px-3 py-1.5 rounded-lg text-sm
              hover:bg-[#111827] transition
            "
          >
            See Product
          </Link>
        </div>
      </div>
    </article>
  );
}
