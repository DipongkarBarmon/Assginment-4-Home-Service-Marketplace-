import { Router } from "express";
import { technicianController } from "./technician.controller.js";
import { Role } from "../../../generated/prisma/enums.js";
import { auth } from "../../Middleware/auth.js";

const router = Router()

router.post('/create-technician-profile',auth(Role.TECHNICIAN),technicianController.createTechnicianProfile)

router.get('/get-technician-profile/:technicianId',technicianController.getTechnicianProfile)
router.get('/get-technician-profile/me',auth(Role.TECHNICIAN),technicianController.getOwnTechnicianProfile)
router.put('/update-technician-profile/:technicianId',auth(Role.TECHNICIAN),technicianController.updateTechnicianProfile)

router.delete('/delete-technician-profile/:technicianId',auth(Role.TECHNICIAN),technicianController.deleteTechnicianProfile) 


router.post('/create-service',auth(Role.TECHNICIAN),technicianController.createService)
router.put('/update-service/:serviceId',auth(Role.TECHNICIAN ),technicianController.updateServiceById)
router.delete('/delete-service/:serviceId',auth(Role.TECHNICIAN),technicianController.deleteServiceById) 


export const technicianRouter = router