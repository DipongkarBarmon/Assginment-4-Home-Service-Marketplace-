import { Router } from "express";
import { adminController } from "./admin.controller.js";
import { auth } from "../../Middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";


const router = Router()

router.get('/get-all-users',auth(Role.ADMIN),adminController.getAllUsers)
router.get('/get-user',auth(Role.ADMIN),adminController.getUserById)
router.put('/update-user-status',auth(Role.ADMIN),adminController.updateUserStatus),
router.delete('/delete-user',auth(Role.ADMIN),adminController.deleteUserById)

export const adminRouter = router 