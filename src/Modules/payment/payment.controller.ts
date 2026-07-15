import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync.js";
import sendRespons from "../../utility/sendResponse.js";
import httpsStatus from "http-status";
import { paymentService } from "./payment.service.js";

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payment = await paymentService.createPaymentIntoDB(req.user.id, req.body);
  sendRespons(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "Payment session created successfully!",
    data: payment,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payment = await paymentService.confirmPaymentIntoDB(req.user.id, req.body);
  sendRespons(res, {
    success: true,
    statusCode: httpsStatus.OK,
    message: "Payment confirmed successfully!",
    data: payment,
  });
});

const getUserPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payments = await paymentService.getUserPaymentHistoryFromDB(req.user.id, req.query);
  sendRespons(res, {
    success: true,
    statusCode: httpsStatus.OK,
    message: "Payment history retrieved successfully!",
    data: payments,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payment = await paymentService.getPaymentByIdFromDB(req.user.id, req.params.paymentId as string);
  sendRespons(res, {
    success: true,
    statusCode: httpsStatus.OK,
    message: "Payment retrieved successfully!",
    data: payment,
  });
});

export const paymentController = {
  createPayment,
  confirmPayment,
  getUserPayments,
  getPaymentById,
};
