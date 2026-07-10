import { Router } from "express";
import { technicianController } from "./technician.controller.js";
import { Role } from "../../../generated/prisma/enums.js";
import { auth } from "../../Middleware/auth.js";

const router = Router()

router.post('/create-technician-profile',auth(Role.TECHNICIAN),technicianController.createTechnicianProfile)

router.get('/get-technician-profile/:technicianId',technicianController.getTechnicianProfile)

router.put('/update-technician-profile/:technicianId',auth(Role.TECHNICIAN),technicianController.updateTechnicianProfile)

router.delete('/delete-technician-profile/:technicianId',auth(Role.TECHNICIAN),technicianController.deleteTechnicianProfile)  


export const technicianRouter = router