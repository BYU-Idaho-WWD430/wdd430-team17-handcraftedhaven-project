import postgres from 'postgres';
import bcrypt from 'bcryptjs';
// Change 1: Import dotenv and call its config method explicitly.
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Specify .env.local if you use it

// Load the database URL from your .env.local file
const dbUrl = process.env.POSTGRES_URL;
if (!dbUrl) {
  throw new Error("La variable de entorno POSTGRES_URL no está definida. Asegúrate de tener un archivo .env.local con la URL de tu base de datos.");
}

// Change 2: Increase the connection timeout to give the database time to wake up.
// Neon can take 5-10 seconds to wake up a sleeping database.
const sql = postgres(dbUrl, { ssl: 'require', connect_timeout: 20 });

async function seedUsers() {
  console.log('Sembrando usuarios...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Note: UUIDs are fixed to maintain consistency between tables.
  const users = [
    // Sellers
    { user_id: '7baf7cfb-84b9-47ba-b554-a146daefec3e', firstname: 'Pedro', lastname: 'Torres', email: 'pedro.torres@example.com', password: hashedPassword, user_type: 'seller' },
    { user_id: '0e2a45e8-7d06-4b89-8a5e-2790e2b79338', firstname: 'Ana', lastname: 'Gomez', email: 'ana.gomez@example.com', password: hashedPassword, user_type: 'seller' },
    // Buyer
    { user_id: '3958dc9e-712f-4377-85e9-fec4b6a6442a', firstname: 'Carlos', lastname: 'Ruiz', email: 'carlos.ruiz@example.com', password: hashedPassword, user_type: 'user' },
  ];

  for (const user of users) {
    await sql`
      INSERT INTO users (user_id, firstname, lastname, email, password, user_type)
      VALUES (${user.user_id}, ${user.firstname}, ${user.lastname}, ${user.email}, ${user.password}, ${user.user_type})
      ON CONFLICT (user_id) DO NOTHING;
    `;
  }
  console.log(`Se sembraron ${users.length} usuarios.`);
}

async function seedSellerProfiles() {
  console.log('Sembrando perfiles de vendedor...');
  const profiles = [
    { user_id: '7baf7cfb-84b9-47ba-b554-a146daefec3e', category: 'Woodwork', description: 'Artisan of wood from Panguipulli.', image_url: '/images/sellers/vendedormadera.png', phone: '123-456-7890' },
    { user_id: '0e2a45e8-7d06-4b89-8a5e-2790e2b79338', category: 'Ceramics', description: 'Creator of fine pottery.', image_url: '/images/sellers/vendedoramujer.png', phone: '098-765-4321' },
  ];

  for (const profile of profiles) {
    await sql`
      INSERT INTO seller_profile (user_id, category, description, image_url, phone)
      VALUES (${profile.user_id}, ${profile.category}, ${profile.description}, ${profile.image_url}, ${profile.phone})
      ON CONFLICT (user_id) DO NOTHING;
    `;
  }
  console.log(`Se sembraron ${profiles.length} perfiles de vendedor.`);
}

async function seedProducts() {
  console.log('Sembrando productos...');
  const products = [
    { user_id: '7baf7cfb-84b9-47ba-b554-a146daefec3e', name: 'Wooden Bowl', price: 25.00, description: 'Hand-carved from native wood.', image: '/images/products/bowl.png', category: 'Kitchenware' },
    { user_id: '7baf7cfb-84b9-47ba-b554-a146daefec3e', name: 'Wooden Cutting Board', price: 35.50, description: 'Durable and beautiful cutting board.', image: '/images/products/cutting-board.png', category: 'Kitchenware' },
    { user_id: '0e2a45e8-7d06-4b89-8a5e-2790e2b79338', name: 'Ceramic Mug', price: 18.00, description: 'Perfect for your morning coffee.', image: '/images/products/mug.png', category: 'Pottery' },
    { user_id: '0e2a45e8-7d06-4b89-8a5e-2790e2b79338', name: 'Decorative Vase', price: 42.00, description: 'A beautiful centerpiece for any room.', image: '/images/products/vase.png', category: 'Decor' },
    { user_id: '7baf7cfb-84b9-47ba-b554-a146daefec3e', name: 'Handmade Wooden Spoon', price: 12.00, description: 'A rustic touch for your kitchen.', image: '/images/products/spoon.png', category: 'Kitchenware' },
    { user_id: '0e2a45e8-7d06-4b89-8a5e-2790e2b79338', name: 'Small Ceramic Plate', price: 22.00, description: 'Ideal for desserts or appetizers.', image: '/images/products/plate.png', category: 'Pottery' },
  ];

  for (const product of products) {
    await sql`
      INSERT INTO product (user_id, name, price, description, image, category)
      VALUES (${product.user_id}, ${product.name}, ${product.price}, ${product.description}, ${product.image}, ${product.category})
      ON CONFLICT (product_id) DO NOTHING;
    `;
  }
  console.log(`Se sembraron ${products.length} productos.`);
}

async function main() {
  await seedUsers();
  await seedSellerProfiles();
  await seedProducts();

  await sql.end();
  console.log('Database seeding completed.');
}

main().catch((err) => {
  console.error('An error occurred during the database seeding process:', err);
  process.exit(1);
});
