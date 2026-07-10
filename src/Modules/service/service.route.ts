
import { Router } from "express";
import { auth } from "../../Middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { serviceController } from "./service.controller.js";

const router = Router() 


router.get('/get-all-service',serviceController.getAllService)
router.get('/get-service/:serviceId',serviceController.getServiceById)


export const serviceRouter = router