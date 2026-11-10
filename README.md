# Tasteman Dry Fruits and Spices – Ecommerce Platform

Full-stack ecommerce system for food materials, built with Next.js, Prisma, and PostgreSQL.

## Project Structure

```
├── prisma/
│   ├── schema.prisma    # Database models (User, Product, Category, Order, Cart, etc.)
│   └── seed.ts          # Seed script for demo data
├── public/
│   └── uploads/         # Local file storage (images, certificates)
├── src/
│   ├── app/
│   │   ├── api/         # API routes
│   │   │   ├── auth/    # register, login, logout, me
│   │   │   ├── cart/    # cart CRUD
│   │   │   ├── categories/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── admin/   # dashboard, products, orders, upload, insights
│   │   ├── auth/        # login, register pages
│   │   ├── products/    # public product list & detail
│   │   ├── customer/    # customer dashboard, cart, orders
│   │   └── admin/       # admin dashboard, products, orders, insights
│   ├── components/
│   │   ├── layout/      # Header, HeaderAuth
│   │   └── ui/          # Button, Card
│   ├── lib/
│   │   ├── auth.ts      # JWT create/verify, getCurrentUser
│   │   ├── prisma.ts    # Prisma client singleton
│   │   ├── storage.ts   # File upload (local, ready for cloud)
│   │   ├── payment/     # Mock + Stripe/Razorpay-ready
│   │   ├── api-response.ts
│   │   └── validations/
│   └── middleware.ts    # Route protection by role
└── .env                 # DATABASE_URL, JWT_SECRET, etc.
```

## How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/tasteman_db"
JWT_SECRET="your-secret-key-min-32-chars"
```

### 3. Set up database

```bash
npm run db:push
npm run db:seed
```

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo users

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Admin   | admin@tasteman.com     | Password123! |
| Customer| customer@example.com   | Password123! |

## Where Products Are Stored

- **Database**: Product metadata (name, price, stock, etc.) in PostgreSQL via Prisma.
- **Images / certificates**: Local files in `public/uploads/` (products, certificates).
- **Storage service** (`src/lib/storage.ts`): Designed for easy migration to cloud (S3, R2). Replace `saveFile()` implementation to switch providers.

## How Auth Works

1. **JWT**: On login/register, a JWT is created with `sub` (userId), `email`, and `role`.
2. **Cookie**: The token is stored in an httpOnly cookie (`auth-token`).
3. **Middleware** (`src/middleware.ts`): On each request, verifies the token and protects routes:
   - `/admin/*` → ADMIN only
   - `/customer/*` → CUSTOMER or ADMIN
   - Public: `/`, `/about`, `/contact`, `/products`, `/auth/*`
4. **API routes**: Use `getCurrentUser()` to read the token and enforce access.

## How to Add a New Feature

1. **API**: Create a route in `src/app/api/` (e.g. `api/reviews/route.ts`).
2. **Validation**: Add Zod schema in `src/lib/validations/`.
3. **Auth check**: Use `getCurrentUser()` and role checks for protected endpoints.
4. **Frontend**: Add page in `src/app/` and call the new API.
5. **Database**: Update `prisma/schema.prisma` and run `npm run db:push` or `npm run db:migrate`.

## How to Plug Real Payments Later

1. **Stripe**:
   - Add `stripe` package: `npm install stripe`
   - Create `src/lib/payment/stripe.ts` implementing `createPayment` and `verifyPayment` using `src/lib/payment/types.ts`
   - Set env: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `PAYMENT_PROVIDER=stripe`
   - Update `src/lib/payment/index.ts` to call the Stripe implementation when `PAYMENT_PROVIDER=stripe`

2. **Razorpay**:
   - Add Razorpay SDK
   - Create `src/lib/payment/razorpay.ts` with the same interface
   - Set env: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `PAYMENT_PROVIDER=razorpay`
   - Wire in `src/lib/payment/index.ts`

The checkout flow in `src/app/api/orders/route.ts` already uses `createPayment()`. Swapping the provider will not require changes to the order API.
