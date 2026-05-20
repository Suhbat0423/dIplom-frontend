# E-Commerce Frontend

Next.js 16 storefront and multi-role dashboard for customers, shop owners, and platform admins. The app connects to an external REST API for auth, stores, products, cart, orders, and demo payments.

## Stack

- Next.js `16.2.1`
- React `19`
- Tailwind CSS `4`
- App Router

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env.local
```

3. Set the API base URL:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

4. Start the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## API Integration

The frontend reads its backend host from `NEXT_PUBLIC_API_BASE_URL`.

Current default:

```txt
http://localhost:8080/api
```

Main route groups:

- `/stores`
- `/auth` and `/users`
- `/products`
- `/cart`
- `/orders`
- `/payments`

## Roles And Auth Flow

### Customer

- Login from `/user`
- Protected routes: `/cart`, `/checkout`, `/orders`, `/orders/[id]`, `/user/profile`
- Session is persisted in browser storage through the existing auth hooks

### Shop Owner

- Login from `/shop/login`
- Register from `/shop/register`
- Protected routes: `/shop/[id]/dashboard`, `/shop/[id]/products`, `/shop/[id]/orders`, `/shop/[id]/settings`, `/shop/[id]/shop-profile`

### Admin

- Current frontend includes `/admin` overview UI
- Real moderation auth/actions are limited by current backend capability
- The codebase does not yet expose a dedicated admin auth flow or moderation endpoints

## Route Map

### Storefront

- `/`
- `/about`
- `/brands`
- `/brands/[id]`
- `/shops`
- `/products/[id]`
- `/search`
- `/cart`
- `/checkout`

### Customer Area

- `/user`
- `/user/profile`
- `/orders`
- `/orders/[id]`

### Shop Area

- `/shop/register`
- `/shop/login`
- `/shop/[id]/dashboard`
- `/shop/[id]/products`
- `/shop/[id]/create-product`
- `/shop/[id]/products/[productId]`
- `/shop/[id]/orders`
- `/shop/[id]/settings`
- `/shop/[id]/shop-profile`

### Admin

- `/admin`

## Payment Demo Flow

Order detail page includes a demo payment panel.

1. Customer places an order from `/checkout`
2. Open `/orders/[id]`
3. Create a manual payment request
4. Confirm or fail the payment
5. If the payment is already paid, trigger a refund
6. Refresh the payment state to sync the order detail panel

Supported demo statuses:

- `pending`
- `paid`
- `failed`
- `refunded`

## UX Conventions

- Shared `LoadingPanel`, `NoticeBanner`, and `PanelState` components are used for consistent loading, empty, and error states
- Dynamic route skeletons are implemented for storefront-heavy pages including product detail and brand pages
- Search uses query-string sync and deferred filtering for smoother typing

## Known Limitations

- `/admin` is not a full moderation panel yet because the current API layer has no dedicated admin endpoints or admin role separation
- Automated tests are not configured in this repository yet
- Some production behavior still depends on backend response consistency, especially around payment and store moderation
- Remote image optimization currently assumes approved hosts configured in `next.config.mjs`

## Deployment Checklist

- Set `NEXT_PUBLIC_API_BASE_URL`
- Verify backend CORS
- Verify payment and order status transitions
- Confirm image hosts in `next.config.mjs`
- Run `npm run lint`
- Run `npm run build`

## Notes

This repository uses Next.js `16`, so follow the current `node_modules/next/dist/docs` guidance for framework conventions instead of older App Router examples.
