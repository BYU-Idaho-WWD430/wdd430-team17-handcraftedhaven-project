import { redirect, notFound } from "next/navigation";
import { auth } from "../../../../../auth";
import {
  fetchSellerById,
  fetchProductsBySellerId,
  fetchStoryBySellerId,
  postNewStory,
} from "@/app/lib/actions";
import {
  updateSellerBasics,
  updateProductFull,
  createProduct,
  updateStoryContent,
  deleteProduct,
  deleteStory,
} from "@/app/lib/sellerActions";
import { Suspense } from "react";
import { Notification } from "@/app/ui/Notification";

const btnPrimary =
  "inline-flex items-center justify-center rounded-md bg-[#0f172a] text-white px-4 py-2 text-sm font-medium hover:bg-[#0b1221] transition border border-black cursor-pointer";
const btnDanger =
  "inline-flex items-center justify-center rounded-md bg-red-600 text-white px-4 py-2 text-base font-bold uppercase hover:bg-red-700 transition border border-black cursor-pointer";

async function saveBasics(formData: FormData): Promise<void> {
  "use server";
  const user_id = String(formData.get("user_id"));
  await updateSellerBasics(formData);
  redirect(`/profiles/${user_id}/edit?saved=1`);
}

async function saveProduct(formData: FormData): Promise<void> {
  "use server";
  const user_id = String(formData.get("user_id") ?? "");
  await updateProductFull(formData);
  redirect(`/profiles/${user_id}/edit?saved=1`);
}

async function addProduct(formData: FormData): Promise<void> {
  "use server";
  const user_id = String(formData.get("user_id"));
  await createProduct(formData);
  redirect(`/profiles/${user_id}/edit?saved=1`);
}

async function removeProduct(formData: FormData): Promise<void> {
  "use server";
  const user_id = String(formData.get("user_id"));
  await deleteProduct(formData);
  redirect(`/profiles/${user_id}/edit?deleted=1`);
}

async function saveStory(formData: FormData): Promise<void> {
  "use server";
  const user_id = String(formData.get("user_id"));
  await updateStoryContent(formData);
  redirect(`/profiles/${user_id}/edit?saved=1`);
}

async function addStory(formData: FormData): Promise<void> {
  "use server";
  const user_id = String(formData.get("user_id"));
  await postNewStory(undefined, formData);
  redirect(`/profiles/${user_id}/edit?saved=1`);
}

async function removeStory(formData: FormData): Promise<void> {
  "use server";
  const user_id = String(formData.get("user_id"));
  await deleteStory(formData);
  redirect(`/profiles/${user_id}/edit?deleted=1`);
}

export default async function EditSellerPage({
  params,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();

  const { id: seller_id } = await params;

  if (!session?.user) redirect("/login");
  if (session.user.id !== seller_id) notFound();

  const [seller] = await fetchSellerById(seller_id);
  if (!seller) notFound();

  const products = await fetchProductsBySellerId(seller_id);
  const stories = await fetchStoryBySellerId(seller_id);
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="text-3xl font-bold">Edit your profile</h1>
        <Suspense fallback={null}>
          <Notification />
        </Suspense>
      </div>

      <section className="mb-10 rounded-2xl border border-[#8B4513]/40 bg-[#FAF7F1] shadow-sm">
        <div className="px-6 py-4 border-b border-black/10">
          <h2 className="text-xl font-semibold">Basic info</h2>
        </div>

        <form
          action={saveBasics}
          className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          <input type="hidden" name="user_id" value={seller_id} />

          <div>
            <label className="block text-sm font-medium mb-1">First name</label>
            <input
              name="firstname"
              defaultValue={seller.firstname}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last name</label>
            <input
              name="lastname"
              defaultValue={seller.lastname}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              name="category"
              defaultValue={seller.category}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              name="phone"
              defaultValue={seller.phone}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              name="description"
              defaultValue={seller.description ?? ""}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
              rows={4}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              name="image_url"
              defaultValue={seller.image_url ?? ""}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
            />
          </div>

          <div className="sm:col-span-2 flex gap-3">
            <button className={btnPrimary}>Save changes</button>
            <span className="text-xs text-gray-500 self-center">
              Your public profile will reflect these changes.
            </span>
          </div>
        </form>
      </section>

      <section className="mb-10 rounded-2xl border border-[#8B4513]/40 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-black/10 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Products</h2>
        </div>

        <div className="p-6 space-y-10">
          {products.map((p) => (
            <div
              key={p.product_id}
              className="rounded-xl border border-black/10 bg-[#FAF7F1] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="font-semibold text-[#1f2937]">{p.name}</div>
                <form action={removeProduct}>
                  <input type="hidden" name="product_id" value={p.product_id} />
                  <input type="hidden" name="user_id" value={seller_id} />
                  <button className={btnDanger} title="Delete product">
                    Delete
                  </button>
                </form>
              </div>

              <form
                action={saveProduct}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                <input type="hidden" name="product_id" value={p.product_id} />
                <input type="hidden" name="user_id" value={seller_id} />

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    name="name"
                    defaultValue={p.name}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={String(p.price)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Image URL
                  </label>
                  <input
                    name="image"
                    defaultValue={p.image ?? ""}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={p.description ?? ""}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
                    rows={3}
                  />
                </div>

                <div className="sm:col-span-2 flex gap-3">
                  <button className={btnPrimary}>Save product</button>
                  <span className="text-xs text-gray-500 self-center">
                    Tip: images from /public or full URLs.
                  </span>
                </div>
              </form>
            </div>
          ))}

          <div className="rounded-xl border border-black/10 p-5">
            <h3 className="text-lg font-semibold mb-3">Add new product</h3>
            <form
              action={addProduct}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              <input type="hidden" name="user_id" value={seller_id} />

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  name="name"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  name="image"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
                  rows={3}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  name="category"
                  defaultValue={seller.category ?? ""}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
                />
              </div>

              <div className="sm:col-span-2 flex gap-3">
                <button className={btnPrimary}>Add product</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-[#8B4513]/40 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-black/10">
          <h2 className="text-xl font-semibold">Stories</h2>
        </div>

        <div className="p-6 space-y-8">
          <div className="rounded-xl border border-black/10 p-5 bg-[#FAF7F1]">
            <h3 className="text-lg font-semibold mb-3">Add new story</h3>
            <form action={addStory} className="space-y-3">
              <input type="hidden" name="user_id" value={seller_id} />
              <textarea
                name="content"
                placeholder="Share your story..."
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
                rows={4}
                minLength={10}
                required
              />
              <div className="flex gap-3">
                <button className={btnPrimary}>Publish story</button>
              </div>
            </form>
          </div>

          {stories.map((s) => (
            <div
              key={s.story_id}
              className="rounded-xl border border-black/10 p-5"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <h4 className="font-semibold">Edit story</h4>
                <form action={removeStory}>
                  <input type="hidden" name="story_id" value={s.story_id} />
                  <input type="hidden" name="user_id" value={seller_id} />
                </form>
              </div>

              <form action={saveStory} className="space-y-3">
                <input type="hidden" name="story_id" value={s.story_id} />
                <input type="hidden" name="user_id" value={seller_id} />
                <textarea
                  name="content"
                  defaultValue={s.content ?? ""}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c49b63]"
                  rows={4}
                  required
                />
                <div className="flex gap-3">
                  <button className={btnPrimary}>Save story</button>
                  <button formAction={removeStory} className={btnDanger}>
                    Delete
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
