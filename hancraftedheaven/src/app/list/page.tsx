import {
  fetchAllCategories,
  fetchAllSellers,
  fetchFilteredProductsCount,
  fetchFilteredProductsPaged,
} from "@/app/lib/actions";
import FilterSidebar from "@/app/ui/catalog/FilterSidebar";
import ProductCard from "@/app/ui/catalog/ProductCard";
import Link from "next/link";

export default async function ProductListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await searchParams;

  // POR DEFECTO 12
  const initialTake = 12;
  const step = 12;
  const take = Number(params.take ?? initialTake);

  const [categories, sellers, total] = await Promise.all([
    fetchAllCategories(),
    fetchAllSellers(),
    fetchFilteredProductsCount(params),
  ]);

  const products = await fetchFilteredProductsPaged(params, take);
  const hasMore = take < total;

  // LOAD MORE
  const buildHref = (nextTake: number) => {
    const qp = new URLSearchParams(params);
    qp.set("take", String(nextTake));
    return `/list?${qp.toString()}`;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-[#3e2723] mb-10">
        All Products
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <FilterSidebar
            categories={categories}
            sellers={sellers
              .map((s) => ({
                id: s.user_id,
                name: `${s.firstname} ${s.lastname}`,
              }))}
          />
        </div>

        {/* Grid + Load more */}
        <div className="w-full lg:w-3/4">
          {products.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-12">
              No products match your filters.
              <br />
              Try adjusting or clearing some filters.
                </p>
              ) : (
                <>
                  <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 w-full max-w-7xl
                  place-items-center sm:place-items-stretch">
                  {products.map((p) => (
                    <ProductCard key={p.product_id} product={p} />
                  ))}
                  </div>
            </div>
              {/* Info de conteo */}
              <p className="text-center text-sm text-gray-600 mt-6">
                Showing <strong>{Math.min(take, total)}</strong> of{" "}
                <strong>{total}</strong> products
              </p>

              {/* Botón Load more */}
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <Link
                    href={buildHref(take + step)}
                    scroll={false}
                    className="px-5 py-2.5 border rounded-md text-sm hover:bg-gray-50"
                  >
                    Load more
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
