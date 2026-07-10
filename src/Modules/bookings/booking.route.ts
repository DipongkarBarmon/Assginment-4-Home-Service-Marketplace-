import { Router } from "express"
import { auth } from "../../Middleware/auth.js"
import { Role } from "../../../generated/prisma/enums.js"
import { bookingController } from "./boiokings.controller.js"


const router = Router()

router.post("/create-booking",auth(Role.CUSTOMER), bookingController.createBooking)
router.get("/get-booking-with-status/:status",auth(Role.CUSTOMER,Role.TECHNICIAN), bookingController.getBookingWithStatus)
router.get("/get-booking-by-id/:bookingId",auth(Role.CUSTOMER,Role.TECHNICIAN), bookingController.getBookingById)
router.get("/get-all-booking",auth(Role.ADMIN), bookingController.getAllBooking)
router.get("/get-user-booking",auth(Role.CUSTOMER), bookingController.getUserBooking)
router.post("/accept-booking/:bookingId",auth(Role.TECHNICIAN), bookingController.acceptBooking)  
router.post("/decline-booking/:bookingId",auth(Role.TECHNICIAN), bookingController.declineBooking)
router.post("/start-working-on-booking/:bookingId",auth(Role.TECHNICIAN), bookingController.startWorkingOnBooking)
router.post("/complete-booking/:bookingId",auth(Role.TECHNICIAN), bookingController.completeBooking)
router.post("/cancel-booking/:bookingId",auth(Role.CUSTOMER), bookingController.cancelBooking)
router.get("/get-booking-by-technician-id-with-status/:technicianId/:status",auth(Role.TECHNICIAN), bookingController.getBookingByTechnicianIdWithStatus)   

export const bookingRouter = router

