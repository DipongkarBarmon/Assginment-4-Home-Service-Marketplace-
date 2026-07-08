import { Router } from "express";
import { authController } from "./auth.controller.js";
import { auth } from "../../Middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router()


router.post('/register',authController.userRegister)
router.post('/login',authController.userLogin)
router.post('/refresh-token',authController.refreshToken)
router.get('/me',auth(Role.ADMIN,Role.CUSTOMER,Role.TECHNITIAN),authController.getUserProfile)
router.put('/update-profile',auth(Role.ADMIN,Role.CUSTOMER,Role.TECHNITIAN),authController.updateUserProfile)
router.delete('/delete-profile',auth(Role.ADMIN,Role.CUSTOMER,Role.TECHNITIAN),authController.deleteUserProfile)


export const authRouter = router