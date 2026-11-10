/**
 * Database seed script for Tasteman Ecommerce
 * Run: npm run db:seed
 * Creates demo categories, products, and users (Admin + Customer)
 */

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash passwords (same for demo: "Password123!")
  const hash = await bcrypt.hash("Password123!", 10);

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@tasteman.com" },
    update: {},
    create: {
      email: "admin@tasteman.com",
      password: hash,
      name: "Admin User",
      role: "ADMIN",
      phone: "+1234567890",
      address: "Tasteman HQ",
    },
  });
  console.log("Created admin:", admin.email);

  // Create Customer users
  const customer1 = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      password: hash,
      name: "John Customer",
      role: "CUSTOMER",
      phone: "+0987654321",
      address: "123 Customer Street, City",
    },
  });
  console.log("Created customer:", customer1.email);

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "dry-fruits" },
      update: {},
      create: {
        name: "Dry Fruits",
        slug: "dry-fruits",
        description: "Premium quality dry fruits - almonds, cashews, raisins, and more.",
      },
    }),
    prisma.category.upsert({
      where: { slug: "spices" },
      update: {},
      create: {
        name: "Spices",
        slug: "spices",
        description: "Authentic spices for cooking and wellness.",
      },
    }),
    prisma.category.upsert({
      where: { slug: "nuts" },
      update: {},
      create: {
        name: "Nuts",
        slug: "nuts",
        description: "Fresh and roasted nuts.",
      },
    }),
  ]);
  console.log("Created categories:", categories.map((c) => c.name).join(", "));

  // Create Products
  const dryFruitsId = categories[0].id;
  const spicesId = categories[1].id;
  const nutsId = categories[2].id;

  const products = [
    { name: "Premium Almonds", slug: "premium-almonds", categoryId: dryFruitsId, basePrice: 15.99, discountPrice: 12.99, stock: 100, description: "California almonds, roasted and salted. Rich in vitamin E and healthy fats." },
    { name: "Cashew Nuts", slug: "cashew-nuts", categoryId: dryFruitsId, basePrice: 22.99, discountPrice: 19.99, stock: 80, description: "Premium whole cashews. Perfect for snacking and cooking." },
    { name: "Golden Raisins", slug: "golden-raisins", categoryId: dryFruitsId, basePrice: 8.99, stock: 150, description: "Sweet, sun-dried golden raisins. Great for baking and snacking." },
    { name: "Turmeric Powder", slug: "turmeric-powder", categoryId: spicesId, basePrice: 9.99, discountPrice: 7.99, stock: 200, description: "Pure organic turmeric. Known for anti-inflammatory properties." },
    { name: "Cumin Seeds", slug: "cumin-seeds", categoryId: spicesId, basePrice: 6.99, stock: 180, description: "Aromatic cumin seeds for authentic flavor." },
    { name: "Cardamom Green", slug: "cardamom-green", categoryId: spicesId, basePrice: 18.99, discountPrice: 15.99, stock: 60, description: "Premium green cardamom pods. Queen of spices." },
    { name: "Walnuts Halves", slug: "walnuts-halves", categoryId: nutsId, basePrice: 14.99, stock: 90, description: "Fresh walnut halves. High in omega-3." },
    { name: "Pistachios", slug: "pistachios", categoryId: nutsId, basePrice: 24.99, discountPrice: 21.99, stock: 70, description: "Roasted salted pistachios. Crunchy and nutritious." },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...p,
        discountPrice: p.discountPrice ?? null,
      },
    });
  }
  console.log("Created", products.length, "products");

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
