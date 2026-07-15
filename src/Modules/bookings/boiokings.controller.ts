import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync.js";
import { bookingService } from "./booking.service.js";
import sendRespons from "../../utility/sendResponse.js";
import httpsStatus from "http-status"
import { BookingStatus } from "../../../generated/prisma/browser.js";


const createBooking = catchAsync(async (req: Request, res: Response, next :NextFunction) => { 
     const {serviceId, availabilityId} = req.body;

     const booking = await bookingService.createBookingIntoDB(req.user.id, serviceId, availabilityId);
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.CREATED,
        message : "Booking created successfully!",
        data : booking
     }) 

})

 

const getBookingById = catchAsync(async (req: Request, res: Response, next :NextFunction) => { 
      const bookingId  = req.params.bookingId 
      const booking = await bookingService.getBookingByIdFromDB(bookingId as string);
      sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Booking retrieved successfully!",
        data : booking
     }) 
})
 


const getUserBooking = catchAsync(async (req: Request, res: Response, next :NextFunction) => {
     const userId = req.user.id;
     const query = req.query;
     const bookings = await bookingService.getUserBookingFromDB(userId, query);
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "User booking retrieved successfully!",
        data : bookings
     }) 
})



const cancelBooking = catchAsync(async (req: Request, res: Response, next :NextFunction) => {
      const bookingId = req.params.bookingId; 
      const booking = await bookingService.cancelBookingIntoDB(bookingId as string);
      sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Booking cancelled successfully!",
        data : booking
     })     
}) 
 



export const bookingController = {
    createBooking,
    getBookingById,
    getUserBooking,
    cancelBooking,
  
}

