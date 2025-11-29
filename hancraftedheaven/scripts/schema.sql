-- Enable the extension to generate UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop the type if it exists to avoid errors on re-running the script.
-- The CASCADE option will also drop any columns that use this type.
DROP TYPE IF EXISTS user_role CASCADE;

-- Create a custom type for user roles
CREATE TYPE user_role AS ENUM ('user', 'seller', 'admin'); -- Removed "IF NOT EXISTS"

-- Users Table (users)
-- Stores basic login information for all users.
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  user_type user_role NOT NULL
);

-- Seller Profile Table (seller_profile)
-- Contains additional information only for users who are sellers/artisans.
CREATE TABLE IF NOT EXISTS seller_profile (
  profile_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  category VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  phone VARCHAR(50)
);

-- Products Table (product)
-- Stores all products created by sellers.
CREATE TABLE IF NOT EXISTS product (
  product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  category VARCHAR(255)
);

-- Reviews Table (review)
-- Contains reviews and ratings that users leave on products.
CREATE TABLE IF NOT EXISTS review (
  review_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES product(product_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stories Table (stories)
-- Allows sellers to share stories on their profile.
CREATE TABLE IF NOT EXISTS stories (
  story_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
