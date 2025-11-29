// src/app/lib/actions.ts
"use server";

import postgres from "postgres";
import { ProductWithSeller, SellerProfile, Review } from "./definitions";

// Configuración de la conexión a la base de datos
// Asegúrate de tener tu variable de entorno POSTGRES_URL configurada
const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/* -------------------- SELLERS -------------------- */
export async function fetchAllSellers(): Promise<SellerProfile[]> {
  return await sql<SellerProfile[]>`
    SELECT 
      s.category, s.description, s.image_url, s.phone, s.user_id,
      u.firstname AS firstname,
      u.lastname AS lastname
    FROM seller_profile s
    JOIN users u ON s.user_id = u.user_id
    ORDER BY u.firstname ASC, u.lastname ASC;
  `;
}

/* -------------------- PRODUCTS -------------------- */
export async function fetchAllProducts(): Promise<ProductWithSeller[]> {
  return await sql<ProductWithSeller[]>`
    SELECT 
      p.product_id, p.name, p.price, p.description, p.image, p.user_id, p.category,
      s.category AS seller_category,
      u.firstname AS seller_firstname,
      u.lastname AS seller_lastname
    FROM product p
    JOIN seller_profile s ON p.user_id = s.user_id
    JOIN users u ON p.user_id = u.user_id
    ORDER BY p.name;
  `;
}

export async function fetchFeaturedProducts(): Promise<ProductWithSeller[]> {
  return await sql<ProductWithSeller[]>`
    SELECT 
      p.product_id, p.name, p.price, p.description, p.image, p.user_id, p.category,
      s.category AS seller_category,
      u.firstname AS seller_firstname,
      u.lastname AS seller_lastname
    FROM product p
    JOIN seller_profile s ON p.user_id = s.user_id
    JOIN users u ON p.user_id = u.user_id
    ORDER BY p.name ASC
    LIMIT 6;
  `;
}

/* -------------------- CATEGORIES -------------------- */
export async function fetchAllCategories(): Promise<
  { category_id: string; category_name: string }[]
> {
  return await sql`
    SELECT DISTINCT category AS category_name, category AS category_id
    FROM seller_profile
    ORDER BY category_name ASC;
  `;
}

// Reviews & Stats
export async function fetchReviewsByProducts(
  product_id: string
): Promise<Review[]> {
  return await sql<Review[]>`
    SELECT 
      r.review_id, r.product_id, r.user_id, r.rating, r.review, r.created_at,
      u.firstname, u.lastname, u.user_id
    FROM review r
    JOIN users u on r.user_id = u.user_id
    WHERE r.product_id = ${product_id}
    ORDER BY r.created_at;
  `;
}

export async function fetchProductStats(product_id: string) {
  try {
    const data = await sql`
      SELECT
        COALESCE(ROUND(AVG(rating), 1), 0.0) AS average_rating,
        COUNT(*) AS review_count
      FROM review
      WHERE product_id = ${product_id};
    `;
    // La consulta devuelve un objeto con `average_rating` y `review_count`
    // que puede ser un string. Nos aseguramos de que sean números.
    const stats = data[0];
    return {
      average_rating: Number(stats.average_rating) || 0,
      review_count: Number(stats.review_count) || 0,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch product statistics.");
  }
}

