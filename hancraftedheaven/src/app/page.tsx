import { fetchFeaturedProducts } from "./lib/actions";
import ProductCard from "./ui/catalog/ProductCard";

export default async function HomePage() {
  const featuredProducts = await fetchFeaturedProducts();

  return (
    <main className="container mx-auto px-4">
      <section className="text-center my-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Handcrafted Haven</h1>
        <p className="text-lg text-gray-600">Discover unique, handmade goods from talented artisans.</p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
