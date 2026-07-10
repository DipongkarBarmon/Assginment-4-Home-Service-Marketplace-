
import { Router } from "express";
import { categoryController } from "./category.controller.js";
import { auth } from "../../Middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router()


router.get('/get-all-category',categoryController.getAllCategory)

router.get('/get-category/:categoryId',categoryController.getCategoryById)


export const categoryRouter = router