# FixItNow 🔧

Backend API for a home-service marketplace where customers book technicians, pay for accepted bookings, and leave reviews after job completion.

## Tech Stack
- Node.js + Express + TypeScript
- Prisma + PostgreSQL
- JWT authentication

## Roles
- **Customer**: browse services, book, pay, track, review
- **Technician**: manage profile/services/availability, accept and complete jobs
- **Admin**: manage users, bookings, and categories

## Payment Module (`/api/payments`)
- `POST /api/payments/create` (Customer): create payment session for an **ACCEPTED** booking
- `POST /api/payments/confirm` (Customer): confirm payment and move booking status to **PAID**
- `GET /api/payments` (Customer): get own payment history
- `GET /api/payments/:paymentId` (Customer): get payment details

### Payment Rules
- Payment can only be created for customer-owned bookings in `ACCEPTED` state
- Successful confirmation updates payment status and marks booking as `PAID`
- Cancelling a `PAID` booking marks successful payment as `REFUNDED`

## Review Module (`/api/reviews`)
- `POST /api/reviews` (Customer): create review after booking is **COMPLETED**

### Review Rules
- Customer can review only their own completed booking
- Only one review per booking
- Rating must be between 1 and 5
- Technician `averageRating` is recalculated after each new review

## Booking Status Flow
`REQUESTED → ACCEPTED → PAID → IN_PROGRESS → COMPLETED`

Customers can cancel before `IN_PROGRESS` (`REQUESTED`, `ACCEPTED`, `PAID`).
