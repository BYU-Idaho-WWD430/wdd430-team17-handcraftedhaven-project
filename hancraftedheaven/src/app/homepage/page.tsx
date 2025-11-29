import Image from "next/image";
import Link from "next/link";
import { fetchFeaturedProducts } from "../lib/actions";
import ProductCard from "../ui/catalog/ProductCard";

export default async function Page() {
  // We obtain featured products from our Server Action
  const products = (await fetchFeaturedProducts())
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 4);

  // Featured artisan ID (Pedro Torres)
  const pedroTorresId = "7baf7cfb-84b9-47ba-b554-a146daefec3e";

  return (
    <main>
      {/* 🏞️ Hero Section - Modified to 2 Columns */}
      <div className="flex flex-col lg:flex-row w-full lg:h-[400px] bg-gray-100">
        {/* Left Side: Image */}
        <div className="relative w-full lg:w-1/2 h-[200px] lg:h-full">
          <Image
            alt="Hero Image"
            src="/images/portada2.png"
            fill
            className="object-cover"
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        {/* Right Side: Welcome Text */}
        <div className="w-full lg:w-1/2 h-full flex flex-col items-start justify-center text-black p-8 md:p-12 lg:p-16">
          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl mb-4">
            Welcome to our <br className="hidden sm:inline" />
            <span className="text-[#5b362e]">Handcrafted Haven!</span>
          </h1>
          <p className="mt-2 text-base sm:text-lg max-w-xl text-gray-700">
            Welcome to Handcrafted Haven, your curated marketplace for
            authentic, artisan-made creations. Connect with talented makers and
            discover pieces with a story. We’re committed to promoting conscious
            creation and conscious consumption. Your journey to find something
            truly special begins here.
          </p>
          <Link
            href="/catalog" // We point to the future catalog page
            className="mt-6 inline-block bg-[#5b362e] text-white font-semibold px-6 py-3 rounded-md shadow-lg hover:bg-[#4a2c24] transition duration-300"
          >
            See Products Now!
          </Link>
        </div>
      </div>

      {/* 🛍️ Featured Products Section */}
      <h2 className="text-center text-3xl sm:text-4xl font-semibold py-14 sm:py-20">
        Featured Products
      </h2>
      <p className="text-center -mt-10 sm:-mt-16 pb-6 sm:pb-10 text-base sm:text-lg text-gray-700 px-4">
        Buy with purpose and give the best of traditional craftsmanship.
      </p>

      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-4 max-w-7xl mx-auto justify-items-center">
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </div>

      {/* 👨‍🎨 Artisan Story Section */}
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
                Pedro <br /> Torres
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
                Wood artisan. Thanks to this craft I have the income to support
                my home. I live in Panguipulli, in the town of Liquiñe—an area
                with many ancient trees that I’ve seen grow from generation to
                generation.
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
