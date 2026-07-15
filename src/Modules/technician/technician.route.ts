import { Router } from "express";
import { technicianController } from "./technician.controller.js";
import { Role } from "../../../generated/prisma/enums.js";
import { auth } from "../../Middleware/auth.js";

const router = Router()

router.post('/create-technician-profile',auth(Role.TECHNICIAN),technicianController.createTechnicianProfile)
router.get('/get-technician-profile/:technicianId',technicianController.getTechnicianProfile)
router.get('/get-technician-profile/me',auth(Role.TECHNICIAN),technicianController.getOwnTechnicianProfile)
router.get('/get-all-technician-profile',technicianController.getAllTechnicianProfile)
router.put('/update-technician-profile/:technicianId',auth(Role.TECHNICIAN),technicianController.updateTechnicianProfile)
router.delete('/delete-technician-profile/:technicianId',auth(Role.TECHNICIAN),technicianController.deleteTechnicianProfile) 


router.post('/create-service',auth(Role.TECHNICIAN),technicianController.createService)
router.put('/update-service/:serviceId',auth(Role.TECHNICIAN ),technicianController.updateServiceById)
router.delete('/delete-service/:serviceId',auth(Role.TECHNICIAN),technicianController.deleteServiceById) 


router.post("/accept-booking/:bookingId",auth(Role.TECHNICIAN), technicianController.acceptBooking)  
router.post("/decline-booking/:bookingId",auth(Role.TECHNICIAN), technicianController.declineBooking)
router.post("/start-working-on-booking/:bookingId",auth(Role.TECHNICIAN), technicianController.startWorkingOnBooking)
router.post("/complete-booking/:bookingId",auth(Role.TECHNICIAN), technicianController.completeBooking)


export const technicianRouter = router