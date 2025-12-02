"use server";

import { z } from "zod";
//import { signIn } from "../../../auth"; // Asegúrate que la ruta a auth.ts sea correcta
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { Prisma } from "@prisma/client";
import { ProductWithSeller, SellerProfile, Review } from "@/app/lib/definitions";
import { revalidatePath } from "next/cache";

/* -------------------- REGISTRATION -------------------- */
const registerSchema = z
  .object({
    firstname: z.string().min(1, "First name is required."),
    lastname: z.string().min(1, "Last name is required."),
    email: z.string().email("Please enter a valid email."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, "Password must include uppercase, lowercase, number, and special character."),
    confirmPassword: z.string().min(8),
    user_type: z.enum(["user", "seller"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function register(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const result = registerSchema.safeParse(rawData);

  if (!result.success) {
    return { success: false, errors: result.error.format(), submittedData: rawData };
  }

  const { firstname, lastname, email, password, user_type } = result.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, message: "A user with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { firstname, lastname, email, password: hashedPassword, user_type },
    });

    return { success: true };
  } catch (error) {
    console.error("Registration failed:", error);
    return { success: false, message: "Registration failed. Please try again." };
  }
}

/* -------------------- LOGIN -------------------- 
export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": return "Invalid credentials.";
        default: return "Something went wrong.";
      }
    }
    throw error;
  }
} */

/* -------------------- DATA FETCHING (READ) -------------------- */

// Helper para mapear el producto de Prisma al tipo que esperan los componentes
const mapProductToProductWithSeller = (
  p: any
): ProductWithSeller & { seller: { firstname: string; lastname: string } } => ({
  ...p, // Mantiene todos los campos del producto (product_id, name, etc.)
  seller: p.seller, // Mantiene el objeto seller anidado, que es lo que espera ProductCard
  category: p.category ?? null, // Asegura que el valor sea string o null, nunca undefined
});

const sellerWithUser = Prisma.validator<Prisma.SellerProfileDefaultArgs>()({
  include: { user: { select: { firstname: true, lastname: true } } },
});

type SellerWithUserPayload = Prisma.SellerProfileGetPayload<typeof sellerWithUser>;

 export async function fetchAllSellers(): Promise<SellerProfile[]> {
  const sellers = await prisma.sellerProfile.findMany({
    include: { user: { select: { firstname: true, lastname: true } } },
    orderBy: [{ user: { firstname: "asc" } }, { user: { lastname: "asc" } }],
  });
  // Tipamos explícitamente el parámetro 's' para asegurar que TypeScript conozca su forma.
  // Esto evita el error 'implicitly has an any type' si la inferencia falla.
  return sellers.map((s: SellerWithUserPayload) => ({
    ...s,
    firstname: s.user.firstname ?? '', // Proporciona un string vacío si es null
    lastname: s.user.lastname ?? '',   // Proporciona un string vacío si es null
    image_url: s.image_url ?? '/images/placeholder-avatar.png',
    phone: s.phone ?? '',
    description: s.description ?? '',
  }));
} 

export async function fetchSellerById(seller_id: string): Promise<SellerProfile | null> {
  const profile = await prisma.sellerProfile.findUnique({
    where: { user_id: seller_id },
    include: { user: { select: { firstname: true, lastname: true } } },
  });
  if (!profile) return null;
  return {
    ...profile,
    firstname: profile.user.firstname,
    lastname: profile.user.lastname ?? '', // Añadimos ?? '' por consistencia
    image_url: profile.image_url ?? '/images/placeholder-avatar.png',
    phone: profile.phone ?? '',
    description: profile.description ?? '',
  };
}

export async function fetchAllProducts(): Promise<ProductWithSeller[]> {
  const products = await prisma.product.findMany({
    include: { seller: { include: { profile: true } } },
    orderBy: { name: "asc" },
  });
  return products.map(mapProductToProductWithSeller);
}

export async function fetchProductById(product_id: string): Promise<ProductWithSeller | null> {
  const product = await prisma.product.findUnique({
    where: { product_id },
    include: { seller: { include: { profile: true } } },
  });
  if (!product) return null;
  return mapProductToProductWithSeller(product);
}

export async function fetchProductsBySellerId(seller_id: string): Promise<ProductWithSeller[]> {
  const products = await prisma.product.findMany({
    where: { user_id: seller_id },
    include: { seller: { include: { profile: true } } },
    orderBy: { name: "asc" },
  });
  return products.map(mapProductToProductWithSeller);
}

export async function fetchFeaturedProducts(): Promise<ProductWithSeller[]> {
  const products = await prisma.product.findMany({
    take: 6,
    include: { seller: { include: { profile: true } } },
    orderBy: { name: "asc" },
  });
  return products.map(mapProductToProductWithSeller);
}

export async function fetchStoryBySellerId(seller_id: string) {
  return await prisma.story.findMany({
    where: { user_id: seller_id },
    select: { story_id: true, content: true, created_at: true },
    orderBy: { created_at: "desc" },
  });
}

function buildWhereClause(searchParams: { categories?: string; sellers?: string; price?: string; }) {
  const { categories, sellers, price } = searchParams;
  const priceRange =
    price === "under-15" ? { lt: 15 } :
    price === "15-30" ? { gte: 15, lte: 30 } :
    price === "above-30" ? { gt: 30 } :
    undefined;

  return {
    seller: categories ? { profile: { category: categories } } : undefined,
    user_id: sellers,
    price: priceRange,
  };
}

export async function fetchFilteredProductsCount(searchParams: { categories?: string; sellers?: string; price?: string; }): Promise<number> {
  const whereClause = buildWhereClause(searchParams);
  return await prisma.product.count({ where: whereClause });
}

export async function fetchFilteredProductsPaged(searchParams: { categories?: string; sellers?: string; price?: string; }, take: number): Promise<ProductWithSeller[]> {
  const whereClause = buildWhereClause(searchParams);
  const products = await prisma.product.findMany({
    where: whereClause,
    include: { seller: { include: { profile: true } } },
    orderBy: { name: "asc" },
    take: take,
  });
  return products.map(mapProductToProductWithSeller);
}

 export async function fetchAllCategories(): Promise<{ category_id: string; category_name: string }[]> {
  const categories = await prisma.sellerProfile.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return categories.map((c) => ({ category_id: c.category, category_name: c.category }));
}
 
 export async function fetchReviewsByProducts(product_id: string): Promise<Review[]> {
  const reviewsFromDb = await prisma.review.findMany({
    where: { product_id },
    include: { user: { select: { firstname: true, lastname: true, user_id: true } } },
    orderBy: { created_at: "asc" },
  });

  return reviewsFromDb.map((r) => ({
    ...r,
    review: r.review ?? "", // Provide a default empty string if review is null
    created_at: r.created_at ?? new Date(), // Provide a default Date if created_at is null
    user: r.user,
  }));
}

export async function fetchProductStats(product_id: string) {
  try {
    const stats = await prisma.review.aggregate({
      _avg: { rating: true },
      _count: { review_id: true },
      where: { product_id: product_id },
    });
    return {
      average_rating: stats._avg.rating?.toFixed(1) ?? "0.0",
      review_count: stats._count.review_id ?? 0,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch product statistics.");
  }
}

/* -------------------- DATA MUTATIONS (CREATE, UPDATE, DELETE) -------------------- */

const storySchema = z.object({
  user_id: z.string().uuid(),
  content: z.string().min(10, "Story must be at least 10 characters"),
});

export async function postNewStory(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const result = storySchema.safeParse(rawData);

  if (!result.success) {
    return { success: false, errors: result.error.format(), submittedData: rawData };
  }

  const { user_id, content } = result.data;
  try {
    await prisma.story.create({ data: { user_id, content } });
    revalidatePath(`/profiles/${user_id}`);
    return { success: true, message: "Story added successfully!" };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Error adding the story, try again." };
  }
}

const reviewSchema = z.object({
  user_id: z.string().uuid(),
  product_id: z.string().uuid(),
  rating: z.coerce.number().min(1).max(5),
  review: z.string().min(10, "Review must be at least 10 characters"),
});

export async function postNewReview(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const result = reviewSchema.safeParse(rawData);

  if (!result.success) {
    return { success: false, errors: result.error.format(), submittedData: rawData };
  }

  const { user_id, product_id, rating, review } = result.data;
  try {
    await prisma.review.create({ data: { user_id, product_id, rating, review } });
    revalidatePath(`/list/${product_id}`);
    return { success: true, message: "Review submitted!" };
  } catch (error) {
    console.error("Failed to post review:", error);
    return { success: false, message: "Failed to submit review. Please try again later." };
  }
}

export async function updateSellerBasics(formData: FormData): Promise<void> {
  const user_id = String(formData.get("user_id"));
  const firstname = String(formData.get("firstname") ?? "");
  const lastname = String(formData.get("lastname") ?? "");
  const category = String(formData.get("category") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const description = String(formData.get("description") ?? "");
  const image_url = String(formData.get("image_url") ?? "");

  await prisma.$transaction([
    prisma.user.update({
      where: { user_id },
      data: { firstname, lastname },
    }),
    prisma.sellerProfile.update({
      where: { user_id },
      data: { category, phone, description, image_url },
    }),
  ]);

  revalidatePath(`/profiles/${user_id}/edit`);
}

const descriptionSchema = z.object({
  product_id: z.uuid(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long.")
    .max(500),
});

export async function updateProductDescription(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const result = descriptionSchema.safeParse(rawData);

  if (!result.success) {
    return { success: false, errors: result.error.format() };
  }

  const { product_id, description } = result.data;
  try {
    await prisma.product.update({ where: { product_id }, data: { description } });
    revalidatePath(`/list/${product_id}`);
    return { success: true, message: "Description updated successfully." };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Failed to update description." };
  }
}

export async function updateProductFull(formData: FormData): Promise<void> {
  const product_id = String(formData.get("product_id"));
  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");
  const image = String(formData.get("image") ?? "");
  const price = Number(formData.get("price") ?? 0);

  await prisma.product.update({
    where: { product_id },
    data: { name, description, image, price },
  });

  revalidatePath(`/list/${product_id}`);
}

export async function createProduct(formData: FormData): Promise<void> {
  const user_id = String(formData.get("user_id"));
  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");
  const image = String(formData.get("image") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const category = String(formData.get("category") ?? "");

  await prisma.product.create({
    data: { name, price, description, image, user_id, category },
  });

  revalidatePath(`/profiles/${user_id}/edit`);
}

export async function deleteProduct(formData: FormData) {
  const product_id = String(formData.get("product_id"));
  const user_id = String(formData.get("user_id")); // Asumimos que el user_id viene del formulario
  try {
    await prisma.product.delete({ where: { product_id, user_id } });
    revalidatePath(`/profiles/${user_id}/edit`);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete product.");
  }
}
