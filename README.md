# Home Service Marketplace — Production-ready API

A production-ready REST API for a home service marketplace (book technicians, manage services, handle payments). Built with Express, TypeScript, Prisma (Postgres) and Stripe for payments.

Base path: `/api`

## Features
- JWT authentication with role-based authorization (ADMIN, TECHNICIAN, CUSTOMER)
- Modules for categories, services, technicians, availability, bookings, payments, reviews, and admin controls
- Stripe Checkout + webhook handling for secure payments
- Global error handling with Prisma-aware mapping (P2002, P2025, etc.)
- Pagination, filtering and search on list endpoints

## Tech Stack
- Runtime: Node.js + TypeScript (ESM)
- Framework: Express
- ORM: Prisma (PostgreSQL)
- Payments: Stripe

## Project Structure (key files)
src/
- app.ts  — Express app, middleware, routes
- server.ts — server bootstrap & Prisma connect
- config/ — environment-backed config
- lib/prisma.ts — Prisma client
- lib/stripe.ts — Stripe client helper
- Middleware/ — `auth.ts`, `globalErrorHandler.ts`, `notFound.ts`
- Modules/ — feature modules (see below)

Modules (folder -> responsibilities)
- `auth` — register/login/refresh/me
- `admin` — list users, update status, manage categories
- `category` — public category listing & details
- `service` — public services listing & details
- `technician` — technician profiles, service management, booking actions
- `availability` — technician availability management
- `bookings` — create/cancel/list bookings
- `payment` — Stripe checkout, webhook, payment history
- `review` — create/read/update/delete reviews

## API Reference (high-level)
All endpoints are described relative to the base path `/api/v1`.

Authentication: many endpoints require role-based auth via `auth` middleware. Roles: `ADMIN`, `TECHNICIAN`, `CUSTOMER`.

### Auth — `/api/v1/auth`
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | /register | public | Register a new user |
| POST | /login | public | Login (returns tokens / sets cookies) |
| POST | /refresh-token | public (cookie) | Refresh access token |
| GET | /me | any role | Get current user profile |
| PUT | /update-profile | any role | Update current user profile |
| DELETE | /delete-profile | any role | Delete current user profile |

### Bookings — `/api/v1/bookings`
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | /create-booking | CUSTOMER | Create booking |
| GET | /get-booking-by-id/:bookingId | CUSTOMER | Get booking by id |
| GET | /get-user-booking | CUSTOMER | List user bookings |
| POST | /cancel-booking/:bookingId | CUSTOMER | Cancel booking |

### Admin — `/api/v1/admin`
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | /get-all-users | ADMIN | List users |
| GET | /get-user | ADMIN | Get user by id (query param) |
| PUT | /update-user-status | ADMIN | Update user status |
| DELETE | /delete-user | ADMIN | Delete user |
| POST | /create-category | ADMIN | Create category |
| PUT | /update-category/:categoryId | ADMIN | Update category |
| DELETE | /delete-category/:categoryId | ADMIN | Delete category |

### Category — `/api/v1/category`
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | /get-all-category | public | List categories |
| GET | /get-category/:categoryId | public | Get category details |

### Service — `/api/v1/service`
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | /get-all-service | public | List services |
| GET | /get-service/:serviceId | public | Get service details |

### Technician — `/api/v1/technician`
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | /create-technician-profile | TECHNICIAN | Create technician profile |
| GET | /get-technician-profile/:technicianId | public | Get profile by id |
| GET | /me | TECHNICIAN | Get own technician profile |
| GET | /get-all-technician-profile | public | List technician profiles |
| PUT | /update-technician-profile/:technicianId | TECHNICIAN | Update profile |
| DELETE | /delete-technician-profile/:technicianId | TECHNICIAN | Delete profile |
| POST | /create-service | TECHNICIAN | Create service |
| PUT | /update-service/:serviceId | TECHNICIAN | Update service |
| DELETE | /delete-service/:serviceId | TECHNICIAN | Delete service |
| POST | /accept-booking/:bookingId | TECHNICIAN | Accept booking |
| POST | /decline-booking/:bookingId | TECHNICIAN | Decline booking |
| POST | /start-working-on-booking/:bookingId | TECHNICIAN | Start work (mark in-progress) |
| POST | /complete-booking/:bookingId | TECHNICIAN | Complete booking |

### Availability — `/api/v1/availability`
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | /create-availability | TECHNICIAN | Create availability slot |
| GET | /get-all-availability | public | List availability |
| DELETE | /delete-availability/:availabilityId | TECHNICIAN | Delete availability |

### Payment — `/api/v1/payment`
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | /checkout | CUSTOMER, ADMIN | Create Stripe checkout session |
| POST | /webhook | public (raw body) | Stripe webhook receiver (verify signature) |
| GET | /payment-history | CUSTOMER, ADMIN | List payments |

### Review — `/api/v1/review`
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | / | CUSTOMER | Create a review |
| GET | /get-reviews | CUSTOMER | Get reviews |
| PATCH | /:id | CUSTOMER | Update review |
| DELETE | /:id | CUSTOMER | Delete review |

## Standard Response Envelope
All successful responses follow the envelope:

```
{
	"success": true,
	"statuscode": 200,
	"message": "...",
	"data": { /* payload */ },
	"meta": { "page": 1, "limit": 10, "total": 0 }
}
```

Errors are normalized by `globalErrorHandler` and map common Prisma errors to HTTP statuses.

## Environment Variables
Create a `.env` in project root with at least the following:

```
PORT=8000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME
APP_URL=http://localhost:3000
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=replace-me
JWT_REFRESH_SECRET=replace-me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Getting Started
Prereqs: Node.js >= 20, PostgreSQL

Install
```
npm install
```

Database
```
npx prisma migrate dev
npx prisma generate
```

Run
```
# Dev
npm run dev

# Build + run
npm run build
npm start
```

## Scripts
- `npm run dev` — start dev server
- `npm run build` — build / bundle
- `npm start` — run built server

## Deployment
Project includes `vercel.json` and is ready to deploy on Vercel. Set env vars in Vercel dashboard.

## Smoke Test
```
curl http://localhost:8000/
curl http://localhost:8000/api/v1/service/get-all-service
```

## Contributing
- Fork, branch, PR. Keep commits small and focused.

## Next steps (optional)
- Add `README` examples with `curl` and Postman collection
- Generate OpenAPI (Swagger) or Postman collection from routes
- Add `.env.example` and contribution guidelines

---
If you want, I can add an OpenAPI spec or example `curl` requests next.
