"use server";

import { z } from "zod";
import { signIn } from "../../../auth";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import { Prisma } from "@prisma/client";
import { ProductWithSeller, SellerProfile, Review } from "@/app/lib/definitions";
import { revalidatePath } from "next/cache";

/* -------------------- REGISTRATION important -------------------- */
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

export type RegisterData = z.infer<typeof registerSchema>;

export type RegisterResult = {
  success: boolean;
  errors?: z.ZodFormattedError<RegisterData>;
  message?: string;
  submittedData?: Record<string, string>;
};

// Validates registration data, checks for existing users, hashes the password,
// creates a new user in the database, and returns a success or error response
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

/* -------------------- LOGIN -------------------- */

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
} 

/* -------------------- DATA FETCHING (READ) -------------------- */

// Helper to map the Prisma product to the type expected by the components
const mapProductToProductWithSeller = (
  p: any
): ProductWithSeller & { seller: { firstname: string; lastname: string } } => ({
  ...p, // Keeps all product fields (product_id, name, etc.)
  seller: p.seller, // Keeps the seller object nested, which is what ProductCard expects
  category: p.category ?? null, // Ensures the value is a string or null, never undefined
});

const sellerWithUser = Prisma.validator<Prisma.SellerProfileDefaultArgs>()({
  include: { user: { select: { firstname: true, lastname: true } } },
});

type SellerWithUserPayload = Prisma.SellerProfileGetPayload<typeof sellerWithUser>;

// Retrieves all sellers with their associated user info, then maps each record
// into a normalized SellerProfile object with safe defaults for missing fields.
export async function fetchAllSellers(): Promise<SellerProfile[]> {
  const sellers = await prisma.sellerProfile.findMany({
    include: { user: { select: { firstname: true, lastname: true } } },
    orderBy: [{ user: { firstname: "asc" } }, { user: { lastname: "asc" } }],
  });
  // We explicitly type the parameter 's' to ensure that TypeScript knows its shape.
  // This avoids the 'implicitly has an any type' error if the inference fails.
  return sellers.map((s: SellerWithUserPayload) => ({
    ...s,
    firstname: s.user.firstname ?? '', // Returns an empty string if null
    lastname: s.user.lastname ?? '',   // Returns an empty string if null
    image_url: s.image_url ?? '/images/placeholder-avatar.png',
    phone: s.phone ?? '',
    description: s.description ?? '',
  }));
} 

// Retrieves a seller’s profile by ID, including their basic user info,
// and returns a normalized profile object with safe defaults for missing fields.
export async function fetchSellerById(seller_id: string): Promise<SellerProfile | null> {
  const profile = await prisma.sellerProfile.findUnique({
    where: { user_id: seller_id },
    include: { user: { select: { firstname: true, lastname: true } } },
  });
  if (!profile) return null;
  return {
    ...profile,
    firstname: profile.user.firstname,
    lastname: profile.user.lastname ?? '', // We added ?? '' for consistency
    image_url: profile.image_url ?? '/images/placeholder-avatar.png',
    phone: profile.phone ?? '',
    description: profile.description ?? '',
  };
}

// Fetches all products from the database, including seller and profile info,
// and maps them into the ProductWithSeller structure.
export async function fetchAllProducts(): Promise<ProductWithSeller[]> {
  const products = await prisma.product.findMany({
    include: { seller: { include: { profile: true } } },
    orderBy: { name: "asc" },
  });
  return products.map(mapProductToProductWithSeller);
}

// Retrieves a single product by its ID, including seller and profile details,
// and returns it mapped into the ProductWithSeller structure (or null if not found).
export async function fetchProductById(product_id: string): Promise<ProductWithSeller | null> {
  const product = await prisma.product.findUnique({
    where: { product_id },
    include: { seller: { include: { profile: true } } },
  });
  if (!product) return null;
  return mapProductToProductWithSeller(product);
}

// Retrieves all products belonging to a specific seller, including seller and profile data,
// then maps them into the ProductWithSeller format.
export async function fetchProductsBySellerId(seller_id: string): Promise<ProductWithSeller[]> {
  const products = await prisma.product.findMany({
    where: { user_id: seller_id },
    include: { seller: { include: { profile: true } } },
    orderBy: { name: "asc" },
  });
  return products.map(mapProductToProductWithSeller);
}

// Fetches the first 6 products (alphabetically) along with seller and profile info,
// then maps them into a unified ProductWithSeller structure.
export async function fetchFeaturedProducts(): Promise<ProductWithSeller[]> {
  const products = await prisma.product.findMany({
    take: 6,
    include: { seller: { include: { profile: true } } },
    orderBy: { name: "asc" },
  });
  return products.map(mapProductToProductWithSeller);
}

// Retrieves all stories posted by a specific seller, returning basic fields
// and ordering them by newest first.
export async function fetchStoryBySellerId(seller_id: string) {
  return await prisma.story.findMany({
    where: { user_id: seller_id },
    select: { story_id: true, content: true, created_at: true },
    orderBy: { created_at: "desc" },
  });
}

// Builds a Prisma-compatible where-clause based on selected filters
// (category, seller, and price range) for product queries.
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

// Returns the total number of products that match the given filter criteria,
// using the same where-clause logic as the paginated product query.
export async function fetchFilteredProductsCount(searchParams: { categories?: string; sellers?: string; price?: string; }): Promise<number> {
  const whereClause = buildWhereClause(searchParams);
  return await prisma.product.count({ where: whereClause });
}

// Fetches a paginated list of products filtered by category, seller, or price,
// including seller and profile details, and maps results into a unified structure.
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

// Retrieves all unique seller categories from the database,
// sorted alphabetically, and returns them in a simplified format.
export async function fetchAllCategories(): Promise<{ category_id: string; category_name: string }[]> {
  const categories = await prisma.sellerProfile.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return categories.map((c) => ({ category_id: c.category, category_name: c.category }));
}
 
// Fetches all reviews for a specific product, including basic user info,
// and returns them with safe defaults for nullable fields.
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

// Retrieves a product’s average rating and total number of reviews
// by aggregating review data in the database.
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

// Zod schema that ensures a valid user_id (UUID) and requires
// the story content to have at least 10 characters.
const storySchema = z.object({
  user_id: z.string().uuid(),
  content: z.string().min(10, "Story must be at least 10 characters"),
});

// Validates story data with Zod, creates a new user story in the database,
// refreshes the user's profile page, and returns a success or error response.
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

// Zod schema validating that review submissions include valid UUIDs,
// a rating between 1 and 5, and a review message of at least 10 characters.
const reviewSchema = z.object({
  user_id: z.string().uuid(),
  product_id: z.string().uuid(),
  rating: z.coerce.number().min(1).max(5),
  review: z.string().min(10, "Review must be at least 10 characters"),
});

type ReviewData = z.infer<typeof reviewSchema>;

export type ReviewFormState = {
  success: boolean;
  message?: string;
  errors?: z.ZodFormattedError<ReviewData>;
  submittedData?: Record<string, string>;
};

// Validates review data with Zod, creates a new product review in the database,
// refreshes the product page, and returns a success or error response.
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

// Updates both the basic user data and the seller profile fields in a single database transaction,
// then refreshes the seller’s edit profile page to reflect the changes.
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

// Zod schema that ensures the product_id is a valid UUID and 
// the description has between 10 and 500 characters.
const descriptionSchema = z.object({
  product_id: z.uuid(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long.")
    .max(500),
});

export type DescriptionFormState = {
  success: boolean;
  message?: string;
  errors?: z.ZodFormattedError<{ description: string; product_id: string }>;
};

// Validates the form data for updating only the product description,
// updates the database if validation passes, and refreshes the product page.
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

// Updates all editable fields of an existing product in the database
// and then refreshes the product detail page to show the updated information.
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

// Creates a new product in the database using the form data
// and then refreshes the user’s edit page to show the updated product list.
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

// Deletes a product from the database using its product_id and the associated user_id,
// then refreshes the user’s edit page to reflect the updated product list.
export async function deleteProduct(formData: FormData) {
  const product_id = String(formData.get("product_id"));
  const user_id = String(formData.get("user_id")); // We assume that the user_id comes from the form
  try {
    await prisma.product.delete({ where: { product_id, user_id } });
    revalidatePath(`/profiles/${user_id}/edit`);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete product.");
  }
}

export type StoryFormState = {
  success: boolean;
  message?: string | null;
  errors?: z.ZodFormattedError<z.infer<typeof storySchema>>;
  submittedData?: Record<string, any>;
};
