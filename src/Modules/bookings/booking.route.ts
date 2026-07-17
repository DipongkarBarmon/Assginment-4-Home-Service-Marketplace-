import { Router } from "express"
import { auth } from "../../Middleware/auth.js"
import { Role } from "../../../generated/prisma/enums.js"
import { bookingController } from "./boiokings.controller.js"


const router = Router()

router.post("/create-booking",auth(Role.CUSTOMER), bookingController.createBooking)
router.get("/get-booking-by-id/:bookingId",auth(Role.CUSTOMER), bookingController.getBookingById)
router.get("/get-user-booking",auth(Role.CUSTOMER), bookingController.getUserBooking)
router.post("/cancel-booking/:bookingId",auth(Role.CUSTOMER), bookingController.cancelBooking)
   

export const bookingRouter = router

