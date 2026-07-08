
import { Router } from "express";
import { auth } from "../../Middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { serviceController } from "./service.controller.js";

const router = Router() 

router.post('/create-service',auth(Role.TECHNITIAN),serviceController.createService)
router.get('/get-all-service',serviceController.getAllService)
router.get('/get-service/:serviceId',serviceController.getServiceById)
router.put('/update-service/:serviceId',auth(Role.TECHNITIAN),serviceController.updateServiceById)
router.delete('/delete-service/:serviceId',auth(Role.TECHNITIAN),serviceController.deleteServiceById) 

export const serviceRouter = router