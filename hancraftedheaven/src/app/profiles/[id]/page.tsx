// app/profiles/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  fetchProductsBySellerId,
  fetchSellerById,
  fetchStoryBySellerId,
} from "@/app/lib/actions";
import ProductCard from "@/app/ui/catalog/ProductCard";
import { PhoneIcon, CalendarDaysIcon } from "@heroicons/react/16/solid";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { auth } from "../../../../auth";
import { StoryTrigger } from "@/app/ui/catalog/stories/StorieTrigger";

/** Fuerza render dinámico para que auth() tenga cookies en Vercel */
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ===================== Tokens de estilo (colores/variantes) ===================== */
const brand = {
  brown: "#3e2723",
  accent: "#c49b63", // bordes / banda lateral
  beige: "#FAF3E8", // fondo de tarjetas
  text: "#1f2937", // gris oscuro
};

const shadowSoft = "shadow-[0_8px_18px_rgba(0,0,0,0.06)]";

const btnPrimary =
  "inline-flex items-center justify-center rounded-md bg-[#0f172a] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#0b1221] transition border border-black";
const btnDanger =
  "inline-flex items-center justify-center rounded-md bg-red-600 text-white px-4 py-2 text-base font-bold uppercase hover:bg-red-700 transition border border-black";

/* ===================== Cover simple por categoría (sin repetir URLs) ===================== */
const COVER_DEFAULT = "/images/sellers/cover-default.png";

/** Reglas: si la categoría contiene estos términos, usamos el archivo correspondiente (sin guiones). */
const COVER_FILE_BY_CATEGORY: Array<[RegExp, string]> = [
  [/pottery|ceramic/i, "fondoalfarero.png"],
  [/jewel|bead/i, "fondojoyeria.png"],
  [/textile|weav/i, "fondotelas.png"],
  [/basket/i, "fondocesteria.png"],
  [/wood/i, "fondomadera.png"],
  [/paint/i, "fondopintura.png"],
];

function coverFromCategory(category?: string | null) {
  const cat = (category ?? "").toString();
  for (const [rx, filename] of COVER_FILE_BY_CATEGORY) {
    if (rx.test(cat)) return `/images/sellers/${filename}`;
  }
  return COVER_DEFAULT;
}

/** Si algún día guardas la portada en BD (profile.cover_image_url), se usa esa; si no, se resuelve por categoría. */
function getCover(profile: {
  category?: string | null;
  cover_image_url?: string | null;
}) {
  if (profile.cover_image_url) return profile.cover_image_url;
  return coverFromCategory(profile.category);
}

/* ===================== Página ===================== */
export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>; // PPR: Promise
}) {
  const session = await auth();
  const { id } = await params;

  const seller = await fetchSellerById(id);
  if (!seller.length) return notFound();
  const profile = seller[0];

  const products = await fetchProductsBySellerId(id);
  const stories = await fetchStoryBySellerId(id);

  const isOwner = session?.user?.id === profile.user_id;

  return (
    <main className="pb-12">
      <section className="relative w-full">
        <Image
          src={getCover(profile)}
          alt="Cover"
          width={1600}
          height={320}
          className="w-full h-44 sm:h-52 md:h-60 lg:h-72 object-cover"
          priority
        />
        {profile.category ? (
          <div className="absolute bottom-2 right-2">
            <span className="rounded-full bg-black/70 text-white text-xs font-medium px-3 py-1 backdrop-blur">
              {profile.category}
            </span>
          </div>
        ) : null}

        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <Image
            src={profile.image_url}
            alt={`${profile.firstname} ${profile.lastname}`}
            width={168}
            height={168}
            className="h-36 w-36 sm:h-40 sm:w-40 rounded-full object-cover ring-4 ring-white shadow-md"
          />
        </div>
      </section>

      <section className="mt-10 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="space-y-6">
          <div
            className={`overflow-hidden rounded-2xl border ${shadowSoft}`}
            style={{ borderColor: `${brand.accent}80` }}
          >
            <div
              className="bg-white px-6 py-4 flex items-center gap-3 border-b"
              style={{ borderColor: "#ead8c7" }}
            >
              <UserCircleIcon
                className="w-6 h-6"
                style={{ color: brand.text }}
              />
              <h3
                className="text-xl font-semibold"
                style={{ color: brand.text }}
              >
                Profile
              </h3>
            </div>

            <div
              className="px-6 py-5 space-y-5"
              style={{ backgroundColor: brand.beige, color: brand.text }}
            >
              <p className="flex items-start gap-3">
                <PhoneIcon
                  className="w-5 h-5 mt-0.5"
                  style={{ color: brand.text }}
                />
                <span>
                  <span className="font-semibold">Phone:</span>{" "}
                  {profile.phone || "—"}
                </span>
              </p>
              <p className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ color: brand.text }}
                >
                  <path d="M4 5a2 2 0 012-2h9a3 3 0 013 3v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM6 5v12h10a1 1 0 001-1V6a1 1 0 00-1-1H6z" />
                </svg>
                <span>
                  <span className="font-semibold">Bio</span>
                  <br />
                  {profile.description || "—"}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h2
              className="text-2xl font-semibold mb-4"
              style={{ color: brand.brown }}
            >
              My Stories
            </h2>

            <div className="flex flex-col gap-5">
              {stories.length ? (
                stories.map((story) => (
                  <article
                    key={story.story_id}
                    className="relative rounded-2xl border shadow-sm p-5"
                    style={{
                      backgroundColor: brand.beige,
                      borderColor: "#ead8c7",
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute left-0 top-3 bottom-3 w-1.5 rounded-full"
                      style={{ backgroundColor: brand.accent }}
                    />
                    <p className="mb-3 pl-3" style={{ color: brand.text }}>
                      {story.content}
                    </p>
                    <p
                      className="text-sm flex items-center gap-2 pl-3"
                      style={{ color: "#4b5563" }}
                    >
                      <CalendarDaysIcon className="w-5" />
                      {new Date(story.created_at).toLocaleDateString()}
                    </p>
                  </article>
                ))
              ) : (
                <div
                  className="rounded-2xl border shadow-sm p-5"
                  style={{
                    backgroundColor: brand.beige,
                    borderColor: "#ead8c7",
                    color: brand.text,
                  }}
                >
                  No stories yet.
                </div>
              )}
            </div>

            {isOwner ? (
              <div className="mt-4">
                <StoryTrigger user_id={profile.user_id} />
              </div>
            ) : null}
          </div>
        </aside>

        <section
          className="lg:col-span-2 lg:border-l lg:pl-8"
          style={{ borderColor: "rgba(0,0,0,0.1)" }}
        >
          <h2
            className="text-2xl font-semibold text-center mb-6"
            style={{ color: brand.brown }}
          >
            Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
            {products.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
