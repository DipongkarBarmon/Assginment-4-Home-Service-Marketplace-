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


const getBookingWithStatus = catchAsync(async (req: Request, res: Response, next :NextFunction) => {
     const status  = req.params.status
     const booking = await bookingService.getBookingWithStatusFromDB(status as BookingStatus);
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Booking retrieved successfully!",
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

const getAllBooking = catchAsync(async (req: Request, res: Response, next :NextFunction) => {
     const bookings = await bookingService.getAllBookingFromDB();
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "All booking retrieved successfully!",
        data : bookings
     }) 
})


const getUserBooking = catchAsync(async (req: Request, res: Response, next :NextFunction) => {
     const userId = req.user.id;
     const bookings = await bookingService.getUserBookingFromDB(userId);
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "User booking retrieved successfully!",
        data : bookings
     }) 
})

const acceptBooking = catchAsync(async (req: Request, res: Response, next :NextFunction) => {
     const bookingId = req.params.bookingId;
     const booking = await bookingService.acceptBookingIntoDB(bookingId as string);
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Booking accepted successfully!",
        data : booking
     }) 
})


const declineBooking = catchAsync(async (req: Request, res: Response, next :NextFunction) => {
     const bookingId = req.params.bookingId;
     const booking = await bookingService.declineBookingIntoDB(bookingId as string);
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Booking declined successfully!",
        data : booking
     }) 
})  

const startWorkingOnBooking = catchAsync(async (req: Request, res: Response, next :NextFunction) => {  
     const bookingId = req.params.bookingId;
     const booking = await bookingService.startWorkingOnBookingIntoDB(bookingId as string);
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Booking started successfully!",
        data : booking
     })  
})

const completeBooking = catchAsync(async (req: Request, res: Response, next :NextFunction) => { 
       const bookingId = req.params.bookingId; 
      const booking = await bookingService.completeBookingIntoDB(bookingId as string);
      sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Booking completed successfully!",
        data : booking
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

const getBookingByTechnicianIdWithStatus = catchAsync(async (req: Request, res: Response, next :NextFunction) => {
      const {technicianId} = req.body;
      const status  = req.params?.status
      const booking = await bookingService.getBookingByTechnicianIdWithStatusFromDB(technicianId as string, status as BookingStatus);
      sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Booking retrieved successfully!",
        data : booking
     })     
})



export const bookingController = {
    createBooking,
    getBookingWithStatus,
    getBookingById,
    getAllBooking,
    getUserBooking,
    acceptBooking,
    declineBooking,
    startWorkingOnBooking,
    completeBooking,
    cancelBooking,
    getBookingByTechnicianIdWithStatus
}

