import { Router } from "express";
import { authCntroller } from "./auth.controller.js";

const router = Router()


router.post('/register',authCntroller.userRegister)
router.post('/login',authCntroller.userLogin)

export const authRouter = router