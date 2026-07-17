 
import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./review.service.js";
import httpStatus from "http-status";
import { catchAsync } from "../../utility/catchAsync.js";
import sendRespons from "../../utility/sendResponse.js";

const createReview = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

  
  const result = await ReviewService.createReview(
    req.user?.id as string,
    req.body 
  );

  sendRespons(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review submitted successfully.",
    data: result,
  });

});

const getMyReviews = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
  const result = await ReviewService.getReviews(
    req.user?.id as string,
    req.query
  );

  sendRespons(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Reviews retrieved successfully.",
    data: result 
  });
});

const getServiceReviews = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
  const result = await ReviewService.getServiceReviews(req.params.serviceId as string,req.query);

  sendRespons(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully.",
    data: result
   
  });
});


const getTechnicianReviews = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
  const result = await ReviewService.getTechnicianReviews(req.params.technicianId as string,req.query);

  sendRespons(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Technician reviews retrieved successfully.",
   
    data: result,
    
  });
});

const updateReview = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
  const result = await ReviewService.updateReview(
    req.user?.id as string,
    req.params.id as string,
    req.body
  );

  sendRespons(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review updated successfully.",
    data: result,
  });
});

const deleteReview = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
  await ReviewService.deleteReview(
    req.user?.id as string,
    req.params?.id as string
  );

  sendRespons(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Review deleted successfully.",
    data: null,
  });
});

export const reviewController = {
  createReview,
  getMyReviews,
  getServiceReviews,
  getTechnicianReviews,
  updateReview,
  deleteReview,
};