import Image from "next/image";
import Link from "next/link";
import { fetchFeaturedProducts } from "@/app/lib/actions";
import ProductCard from "./ui/catalog/ProductCard";

export default async function Page() {
  const featuredProducts = await fetchFeaturedProducts();
  const pedroTorresId = "7baf7cfb-84b9-47ba-b554-a146daefec3e"; // ID de ejemplo para el artesano destacado

  return (
    <main className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="grid w-full grid-cols-1 bg-white md:grid-cols-2">
        <div className="relative h-80 w-full md:h-auto min-h-[400px] lg:min-h-[600px]">
          <Image
            alt="Artisan crafting a wooden bowl"
            src="/images/portada2.png"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 767px) 100vw, 50vw"
          />
        </div>
 
        <div className="flex items-center justify-center">
          <div className="flex w-full flex-col items-start justify-center p-8 md:w-1/2 md:p-12 lg:p-20"> {/* Ajustado para centrar el contenido */}
            <h3 className="text-lg font-semibold uppercase tracking-widest text-amber-600">
              Where Every Piece Tells a Story
            </h3>
            <h1 className="mt-4 font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight text-[#3e2723]">
              Discover Authentic, <br className="hidden sm:inline" />
              Artisan-Made Creations
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-600">
              Connect with talented makers from around the world and find unique, handcrafted treasures that bring soul to your home.
            </p>
            <Link
              href="/products"
              className="mt-10 inline-block rounded-lg bg-[#5b362e] px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#4a2c24] hover:shadow-xl"
            >
              Explore the Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 sm:py-24">
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Featured Products
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Buy with purpose and give the best of traditional craftsmanship.
          </p>
        </div>
        <div className="flex justify-center px-4">
          <div className="grid max-w-screen-xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Artisan Spotlight Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[320px] sm:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/sellers/vendedormadera.png"
              alt="Pedro Torres - Wood Artisan"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(min-width: 1024px) 600px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute left-6 bottom-6 sm:left-8 sm:bottom-8">
              <p className="uppercase tracking-[0.2em] text-white/90 text-sm sm:text-base">
                Artisan
              </p>
              <h3 className="text-white font-extrabold leading-none text-3xl sm:text-5xl md:text-6xl drop-shadow">
                Pedro <br /> Torres
              </h3>
            </div>
            <Link
              href={`/profiles/${pedroTorresId}`}
              className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 border-2 border-white bg-[#5b362e] text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg shadow-md hover:bg-[#4a2c24] transform hover:-translate-y-0.5 transition-all"
            >
              VIEW PROFILE
            </Link>
          </div>

          <div className="flex flex-col justify-center px-4 lg:px-0">
            <h3 className="text-3xl sm:text-4xl font-semibold text-[#1f2937] mb-2">
              Meet the Artisan
            </h3>
            <p className="text-gray-500 mb-6 sm:mb-8">Wisdom from our land</p>

            <div className="relative bg-white">
              <div className="text-6xl text-[#5b362e]/50 leading-none mb-2 select-none">
                &ldquo;
              </div>
              <blockquote className="text-xl sm:text-2xl italic leading-relaxed text-gray-700 border-l-4 border-[#5b362e] pl-6">
                Wood artisan. Thanks to this craft I have the income to support
                my home. I live in Panguipulli, in the town of Liquiñe—an area
                with many ancient trees that I’ve seen grow from generation to
                generation.
              </blockquote>
              <div className="text-6xl text-[#5b362e]/50 leading-none mt-2 text-right select-none">
                &rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
