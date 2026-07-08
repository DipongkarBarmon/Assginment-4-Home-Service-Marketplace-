import { Router } from "express";
import { availabilityController } from "./availability.controller.js";
import { auth } from "../../Middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";
const router = Router()

router.post('/create-availability',auth(Role.TECHNITIAN),availabilityController.createAvailability)
router.get('/get-all-availability',availabilityController.getAllAvailability),
router.get('/get-booked-availability',availabilityController.getBookedAvailabilityByTechnicianId)
router.get('/get-free-availability',availabilityController.getFreeAvailabilityByTechnicianId)
router.delete('/delete-availability/:availabilityId',auth(Role.TECHNITIAN),availabilityController.deleteAvailabilityById)


export const availabilityRouter = router


