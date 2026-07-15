import { Router } from "express";
import { auth } from "../../Middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";
import { paymentController } from "./payment.controller.js";

const router = Router();

router.post("/create", auth(Role.CUSTOMER), paymentController.createPayment);
router.post("/confirm", auth(Role.CUSTOMER), paymentController.confirmPayment);
router.get("/", auth(Role.CUSTOMER), paymentController.getUserPayments);
router.get("/:paymentId", auth(Role.CUSTOMER), paymentController.getPaymentById);

export const paymentRouter = router;
