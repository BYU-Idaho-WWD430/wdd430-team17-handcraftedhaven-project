import Image from "next/image";
import Link from "next/link";
import { fetchFeaturedProducts } from "@/app/lib/actions";
import ProductCard from "./ui/catalog/ProductCard";

export default async function Page() {
  const featuredProducts = await fetchFeaturedProducts();
  const pedroTorresId = "7baf7cfb-84b9-47ba-b554-a146daefec3e"; // ID de ejemplo para el artesano destacado

  return (
    <main className="bg-gray-50">
        <div className="relative">
          <Image
            src="/images/portada2.png"
            alt="Artisan crafting a wooden bowl"
            height={400}
            width={1200}
            className="w-full h-auto object-cover"
            priority
            sizes="100vw"
          />
 
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-black/40 px-4">
            <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl">
              Handcrafted Haven
            </h1>
            <p className="mt-3 text-base sm:text-lg max-w-3xl">
                {/* Each piece tells a story you can take with you. Welcome to your curated marketplace for authentic, artisan-made creations.*/}
                Welcome to your marketplace for unique, artisan-crafted treasures. Connect directtly with talented makers and discover pieces with a story. We're building a community that celebrates creativity and conscious consumtion. Your journey to find something truly special begins here.
                
            </p>
          </div>
        </div>

      <h2 className="text-center text-3xl sm:text-4xl font-semibold py-14 sm:py-20">
        Product Collection
      </h2>
       <p className="text-center -mt-10 sm:-mt-16 pb-6 sm:pb-10 text-base sm:text-lg text-gray-700 px-4">
         Buy with purpose and give the best of traditional craftsmanship.
      </p>

      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-4 max-w-7xl mx-auto justify-items-center">
          {featuredProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </div>

     <section className="mt-16 sm:mt-24 mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative h-[320px] sm:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/sellers/vendedormadera.png"
              alt="Pedro Torres - Wood Artisan"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 600px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute left-5 bottom-5 sm:left-8 sm:bottom-8">
              <p className="uppercase tracking-[0.2em] text-white/90 text-sm sm:text-base">
                Artisan
              </p>
              <h3 className="text-white font-extrabold leading-none text-3xl sm:text-5xl md:text-6xl drop-shadow">
                Robert <br /> Martinez
              </h3>
            </div>
            <Link
              href={`/profiles/${pedroTorresId}`}
              className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 border-2 border-white bg-[#5b362e] text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 rounded shadow hover:bg-[#4a2c24] transition"
            >
              VIEW PROFILE
            </Link>
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="text-3xl sm:text-4xl font-semibold text-[#1f2937] mb-2">
              My Story
            </h3>
            <p className="text-[#6b7280] mb-6 sm:mb-8">Wisdom from our land</p>

            <div className="relative bg-white">
              <div className="text-5xl sm:text-6xl text-[#5b362e] leading-none mb-3 sm:mb-4 select-none">
                &ldquo;
              </div>
              <p className="text-lg sm:text-2xl leading-relaxed text-[#374151]">
                Since my early life I had to work with my
                dad on the farm doing the tough job of
                preparing the land for the harvest. I learned
                to make the best handcrafted tables and chairs
                from the wood we used to build the fences.
                Every piece I create carries a part of my
                heritage and the love for my land.
              </p>
              <div className="text-5xl sm:text-6xl text-[#5b362e] leading-none mt-3 sm:mt-4 text-right select-none">
                &rdquo;
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="h-12 sm:h-16" />
    </main>
  );
}
