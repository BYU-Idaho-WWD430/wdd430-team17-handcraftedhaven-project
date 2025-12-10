import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { auth } from "../../../../auth";
import { fetchProductById, fetchReviewsByProducts } from "@/app/lib/actions";
import ReviewCard from "@/app/ui/Reviews";
import { EditableDescription } from "@/app/ui/EditableDescription";

const brand = {
  accent: "#c49b63",
  text: "#1f2937",
  brown: "#3e2723",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>; // 👈 PPR: params es Promise
}) {
  const { id } = await params;     // 👈 esperar antes de usar

  const rawProduct = await fetchProductById(id);
  if (!rawProduct?.length) return notFound();
  const product = rawProduct[0];

  const session = await auth();
  const reviews = await fetchReviewsByProducts(id);

  const price =
    typeof product.price === "number"
      ? product.price.toFixed(2)
      : Number(product.price).toFixed(2);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div>
          <div
            className="rounded-3xl overflow-hidden border-4 shadow-md"
            style={{ borderColor: brand.accent }}
          >
            <Image
              src={product.image}
              alt={product.name}
              width={1200}
              height={900}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

        <div>
          <h1
            className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ color: brand.text }}
          >
            {product.name}
          </h1>

          <p
            className="text-2xl font-extrabold mb-2"
            style={{ color: brand.brown }}
          >
            {product.category}
          </p>

          <div className="mb-4">
            <EditableDescription
              product={product}
              isOwner={session?.user?.id === product.user_id}
            />
          </div>

          <p className="flex items-center gap-2 text-3xl font-extrabold text-green-600 mb-2">
            <CurrencyDollarIcon className="w-7 h-7" />
            {price}
          </p>

          <p className="mb-6">
            <Link
              href={`/profiles/${product.user_id}`}
              className="text-blue-600 hover:underline"
            >
              By: {product.seller_firstname} {product.seller_lastname}
            </Link>
          </p>

          <div className="border-t" style={{ borderColor: "#ead8c7" }} />
        </div>
      </section>

      {/* Reviews */}
      <section className="mt-10">
        <ReviewCard authenticated={session} reviews={reviews} product_id={id} />
      </section>
    </main>
  );
}
