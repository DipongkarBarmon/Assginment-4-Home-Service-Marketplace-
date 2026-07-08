
import { Router } from "express";
import { categoryController } from "./category.controller.js";
import { auth } from "../../Middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router()

router.post('/create-category',auth(Role.ADMIN),categoryController.createCategory)
router.get('/get-all-category',categoryController.getAllCategory)
router.get('/get-category/:categoryId',categoryController.getCategoryById)
router.put('/update-category/:categoryId',auth(Role.ADMIN),categoryController.updateCategoryById)
router.delete('/delete-category/:categoryId',auth(Role.ADMIN),categoryController.deleteCategoryById)  

export const categoryRouter = router