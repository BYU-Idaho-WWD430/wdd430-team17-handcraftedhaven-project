import Image from "next/image";
import Link from "next/link";
import { fetchAllSellers } from "../lib/actions";

export default async function ProfilesPage() {
  const sellers = (await fetchAllSellers()).sort((a, b) =>
    `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`)
  );

  return (
    <main className="w-full">
      <div className="relative h-[300px] sm:h-[400px] md:h-[520px]">
        <Image
          src="/images/fondoseller.webp"
          alt="Seller background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-black/40 px-4">
          <h1 className="font-bold drop-shadow-lg text-2xl sm:text-4xl md:text-6xl">
            The Art in the Hands of the Masters
          </h1>
        </div>
      </div>

      <h2 className="text-center text-3xl sm:text-4xl font-semibold py-12 sm:py-16">
        Seller Profiles
      </h2>

      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 px-4 max-w-6xl mx-auto justify-items-center pb-10">
          {sellers.map((s) => (
            <article
              key={s.user_id}
              className="
                w-full max-w-[340px]
                bg-white rounded-3xl border border-[#8B4513]
                shadow-[0_4px_14px_rgba(0,0,0,0.18)]
                p-4 flex flex-col transition-transform hover:-translate-y-0.5
              "
            >
              <div className="relative w-full h-48 sm:h-56 md:h-60 overflow-hidden rounded-2xl">
                <Image
                  src={s.image_url}
                  alt={`${s.firstname} ${s.lastname}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                />
              </div>

              <div className="pt-5 px-1 sm:px-2 flex flex-col flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-[#1f2937] text-center">
                  {s.firstname} {s.lastname}
                </h3>

                <div className="mt-2 inline-flex w-fit items-center rounded-full bg-[#f3f4f6] px-3 py-1 text-sm font-medium text-[#374151] mx-auto">
                  {s.category}
                </div>

                <p className="mt-3 text-[15px] leading-6 text-[#4b5563] line-clamp-3 text-center">
                  {s.description}
                </p>

                <div className="mt-auto pt-6 flex justify-center">
                  <Link
                    href={`/profiles/${s.user_id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[#0f172a] px-5 py-3 text-white font-medium hover:bg-[#0b1221] transition"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
