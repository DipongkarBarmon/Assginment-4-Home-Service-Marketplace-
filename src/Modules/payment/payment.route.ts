import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { auth } from "../../Middleware/auth.js";
import { paymentController } from "./payment.controller.js";
 

const router = Router();

router.post('/checkout',auth(Role.CUSTOMER,Role.ADMIN), paymentController.createCheckoutSession);
router.post('/webhook', paymentController.handleStripeWebhook);
router.get('/payment-history', auth(Role.CUSTOMER,Role.ADMIN), paymentController.getPaymentHistory);
 
export const paymentRouter = router;