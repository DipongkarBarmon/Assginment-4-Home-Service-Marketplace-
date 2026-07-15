import { Router } from "express";
import { auth } from "../../Middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { reviewController } from "./review.controller.js";

const router = Router();

router.post("/", auth(Role.CUSTOMER), reviewController.createReview);

export const reviewRouter = router;
