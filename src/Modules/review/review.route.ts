import { Router } from "express";
import { auth } from "../../Middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { reviewController } from "./review.controller.js";
 


const router =Router();


router.post("/",auth(Role.CUSTOMER), reviewController.createReview);

router.get("/get-reviews",auth(Role.CUSTOMER),reviewController.getReviews);

 

router.patch("/:id",auth(Role.CUSTOMER),reviewController.updateReview
);

router.delete("/:id",auth(Role.CUSTOMER), reviewController.deleteReview);

export const reviewRouter = router;