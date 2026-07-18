# Home Service Marketplace

Brief project README with module overview and API routes.

## Modules
- Auth: user registration, login, profile management, token refresh.
- Admin: user management and category management (admin-only).
- Category: public category listing and details.
- Service: public service listing and details.
- Technician: technician profile and service management, booking workflow actions.
- Availability: technician availability management.
- Bookings: create/cancel bookings and user booking retrieval.
- Payment: Stripe checkout, webhook handling, payment history.
- Review: customers can create/read/update/delete reviews.

## API Routes

Note: `Auth` column shows required roles (if any). Controller method indicates the handler in the codebase.

### Auth Module
| Method | Endpoint | Auth | Description | Controller |
| --- | --- | --- | --- | --- |
| POST | /register | public | Create a new user | `authController.userRegister` |
| POST | /login | public | Authenticate user and return tokens | `authController.userLogin` |
| POST | /refresh-token | public | Refresh auth tokens | `authController.refreshToken` |
| GET | /me | ADMIN, CUSTOMER, TECHNICIAN | Get current user profile | `authController.getUserProfile` |
| PUT | /update-profile | ADMIN, CUSTOMER, TECHNICIAN | Update current user profile | `authController.updateUserProfile` |
| DELETE | /delete-profile | ADMIN, CUSTOMER, TECHNICIAN | Delete current user profile | `authController.deleteUserProfile` |

### Bookings Module
| Method | Endpoint | Auth | Description | Controller |
| --- | --- | --- | --- | --- |
| POST | /create-booking | CUSTOMER | Create a new booking | `bookingController.createBooking` |
| GET | /get-booking-by-id/:bookingId | CUSTOMER | Get booking by id (belongs to user) | `bookingController.getBookingById` |
| GET | /get-user-booking | CUSTOMER | List bookings for current user | `bookingController.getUserBooking` |
| POST | /cancel-booking/:bookingId | CUSTOMER | Cancel a booking | `bookingController.cancelBooking` |

### Admin Module
| Method | Endpoint | Auth | Description | Controller |
| --- | --- | --- | --- | --- |
| GET | /get-all-users | ADMIN | List all users | `adminController.getAllUsers` |
| GET | /get-user | ADMIN | Get a user by id (query param) | `adminController.getUserById` |
| PUT | /update-user-status | ADMIN | Update a user's status | `adminController.updateUserStatus` |
| DELETE | /delete-user | ADMIN | Delete user by id | `adminController.deleteUserById` |
| POST | /create-category | ADMIN | Create a new category | `adminController.createCategory` |
| PUT | /update-category/:categoryId | ADMIN | Update category by id | `adminController.updateCategoryById` |
| DELETE | /delete-category/:categoryId | ADMIN | Delete category by id | `adminController.deleteCategoryById` |

### Category Module
| Method | Endpoint | Auth | Description | Controller |
| --- | --- | --- | --- | --- |
| GET | /get-all-category | public | List all categories | `categoryController.getAllCategory` |
| GET | /get-category/:categoryId | public | Get category details | `categoryController.getCategoryById` |

### Service Module
| Method | Endpoint | Auth | Description | Controller |
| --- | --- | --- | --- | --- |
| GET | /get-all-service | public | List all services | `serviceController.getAllService` |
| GET | /get-service/:serviceId | public | Get service details | `serviceController.getServiceById` |

### Technician Module
| Method | Endpoint | Auth | Description | Controller |
| --- | --- | --- | --- | --- |
| POST | /create-technician-profile | TECHNICIAN | Create technician profile | `technicianController.createTechnicianProfile` |
| GET | /get-technician-profile/:technicianId | public | Get technician profile by id | `technicianController.getTechnicianProfile` |
| GET | /me | TECHNICIAN | Get own technician profile | `technicianController.getOwnTechnicianProfile` |
| GET | /get-all-technician-profile | public | List all technician profiles | `technicianController.getAllTechnicianProfile` |
| PUT | /update-technician-profile/:technicianId | TECHNICIAN | Update a technician profile | `technicianController.updateTechnicianProfile` |
| DELETE | /delete-technician-profile/:technicianId | TECHNICIAN | Delete a technician profile | `technicianController.deleteTechnicianProfile` |
| POST | /create-service | TECHNICIAN | Create a service offered by a technician | `technicianController.createService` |
| PUT | /update-service/:serviceId | TECHNICIAN | Update a service by id | `technicianController.updateServiceById` |
| DELETE | /delete-service/:serviceId | TECHNICIAN | Delete a service by id | `technicianController.deleteServiceById` |
| POST | /accept-booking/:bookingId | TECHNICIAN | Accept assigned booking | `technicianController.acceptBooking` |
| POST | /decline-booking/:bookingId | TECHNICIAN | Decline assigned booking | `technicianController.declineBooking` |
| POST | /start-working-on-booking/:bookingId | TECHNICIAN | Mark booking as started (work) | `technicianController.startWorkingOnBooking` |
| POST | /complete-booking/:bookingId | TECHNICIAN | Mark booking as completed | `technicianController.completeBooking` |

### Availability Module
| Method | Endpoint | Auth | Description | Controller |
| --- | --- | --- | --- | --- |
| POST | /create-availability | TECHNICIAN | Create availability slot | `availabilityController.createAvailability` |
| GET | /get-all-availability | public | List all availability slots | `availabilityController.getAllAvailability` |
| DELETE | /delete-availability/:availabilityId | TECHNICIAN | Delete availability by id | `availabilityController.deleteAvailabilityById` |

### Payment Module
| Method | Endpoint | Auth | Description | Controller |
| --- | --- | --- | --- | --- |
| POST | /checkout | CUSTOMER, ADMIN | Create Stripe checkout session | `paymentController.createCheckoutSession` |
| POST | /webhook | public | Stripe webhook handler (signature verification) | `paymentController.handleStripeWebhook` |
| GET | /payment-history | CUSTOMER, ADMIN | List payment history for current user | `paymentController.getPaymentHistory` |

### Review Module
| Method | Endpoint | Auth | Description | Controller |
| --- | --- | --- | --- | --- |
| POST | / | CUSTOMER | Create a review | `reviewController.createReview` |
| GET | /get-reviews | CUSTOMER | Get reviews (for user or resource) | `reviewController.getReviews` |
| PATCH | /:id | CUSTOMER | Update a review by id | `reviewController.updateReview` |
| DELETE | /:id | CUSTOMER | Delete a review by id | `reviewController.deleteReview` |

## Notes & Next Steps
- Routes are defined under `src/Modules/*/*.route.ts`.
- Many endpoints require role-based auth via `auth` middleware and `Role` enums.
- Consider adding example requests, response schemas, and authentication examples (Bearer token) to this README.

If you want, I can add example `curl` requests, a Postman collection, or OpenAPI spec next.
