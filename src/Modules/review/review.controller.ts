import httpsStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync.js";
import sendRespons from "../../utility/sendResponse.js";
import { reviewService } from "./review.service.js";

const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const review = await reviewService.createReviewIntoDB(req.user.id, req.body);

  sendRespons(res, {
    success: true,
    statusCode: httpsStatus.CREATED,
    message: "Review created successfully!",
    data: review,
  });
});

export const reviewController = {
  createReview,
};
