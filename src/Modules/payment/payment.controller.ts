import { NextFunction, Request, Response } from "express";
 
 
import httpStatus from "http-status";
import { catchAsync } from "../../utility/catchAsync.js";
import sendResponse from "../../utility/sendResponse.js";
import { paymentService } from "./payment.service.js";

const createCheckoutSession = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
   
   const userId = req.user?.id;

   const checkoutSession = await paymentService.createCheckoutSession( userId as string , req.body);

   return sendResponse(res,{
       success: true,
       statusCode: httpStatus.OK,
       message: "Checkout session created successfully",
       data: checkoutSession
   });
    
})


const handleStripeWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const event  = req.body as Buffer;
    const signature = req.headers['stripe-signature']!;

    await paymentService.handleStripeWebhook(event, signature as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Webhook handled successfully",
        data: null
    }); 
});


const getPaymentHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const role = req.user?.role;
    const queryParams = req.query;
    const paymentHistory = await paymentService.getPaymentHistory(userId as string,role as string,queryParams);

    return sendResponse(res, {
        success: true,
        statusCode  : httpStatus.OK,
        message: "Payment history fetched successfully",
        data: paymentHistory,
    });
});

 
export const paymentController = {
    createCheckoutSession,
    handleStripeWebhook,
    getPaymentHistory,
}