import Image from 'next/image';
import Link from 'next/link';
import RatingStars from './RatingStars';
import { Prisma } from '@prisma/client';

// Extends Product type to include seller information returned from the query
type ProductWithSeller = Prisma.ProductGetPayload<{
  include: {
    seller: {
      select: {
        firstname: true;
        lastname: true;
      };
    };
  };
}>;

interface Props {
  product: ProductWithSeller;
}

export default function ProductCard({ product }: Props) {
  // Build seller’s full display name
  const sellerName = `${product.seller.firstname} ${product.seller.lastname}`;

  // Ensure price is formatted with two decimal places
  const price = product.price.toFixed(2);

  // Temporary random rating for design display (until real rating is implemented)
  const randomRating = Math.floor(Math.random() * 3) + 3; // Between 3 and 5

  return (
    <div className="group flex h-[30rem] w-full max-w-[22rem] flex-col overflow-hidden rounded-2xl border-4 border-[#c49b63] bg-[#fdf8f3] shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="relative h-1/2 w-full overflow-hidden">
        <Link href={`/products/${product.product_id}`} className="block h-full w-full">
            <Image
              src={product.image || '/images/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            />
        </Link>
      </div>

      <div className="flex flex-grow flex-col p-5">
        <div className="flex-grow">
          <p className="mb-1 text-sm uppercase tracking-wider text-amber-700">{product.category}</p>
          <h3 className="text-xl font-bold text-[#3e2723] group-hover:text-amber-800 transition-colors">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            {product.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <RatingStars rating={randomRating} />
          <Link href={`/profiles/${product.user_id}`} className="text-xs text-gray-500 transition-colors hover:text-blue-700 hover:underline">
            by {sellerName}
          </Link>
        </div>

        <div className="mt-auto flex items-end justify-between pt-5">
          <span className="text-3xl font-bold text-green-800">${price}</span>
          <Link href={`/products/${product.product_id}`} className="rounded-lg bg-[#1f2937] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-amber-800 hover:shadow-lg">
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}

