
import { Router } from "express";
import { auth } from "../../Middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { serviceController } from "./service.controller.js";

const router = Router() 

router.post('/create-service/:technicianId',auth(Role.TECHNITIAN),serviceController.createService)


export const serviceRouter = router