import { NextFunction, Request, Response } from "express";
import sendRespons from "../../utility/sendResponse.js";
import { catchAsync } from "../../utility/catchAsync.js";
import httpsStatus from "http-status"
import { availabilityService } from "./availability.service.js";

const createAvailability = catchAsync(async( req : Request, res : Response, next : NextFunction) => {
    
     const result = await availabilityService.createAvailabilityIntoDB(req.user.id,req.body)

     sendRespons(res, {
          success : true,
          statusCode : httpsStatus.CREATED,
          message : "Availability created successfully!",
          data : result
      })
})



const getAllAvailability = catchAsync(async( req : Request, res : Response, next : NextFunction) => {
      const result = await availabilityService.getAllAvailabilityFromDB()
      sendRespons(res, {
          success : true,
          statusCode : httpsStatus.OK,
          message : "All availability retrieved successfully!",
          data : result
      })
})

const deleteAvailabilityById = catchAsync(async( req : Request, res : Response, next : NextFunction) => {
      const {availabilityId} = req.params
      await availabilityService.deleteAvailabilityByIdFromDB(availabilityId as string)
      sendRespons(res, {
          success : true,
          statusCode : httpsStatus.OK,
          message : "Availability deleted successfully!",
          data : null
      })
})  

const getBookedAvailabilityByTechnicianId = catchAsync(async( req : Request, res : Response, next : NextFunction) => {
      const {technicianId} = req.body
      const result = await availabilityService.getBookedAvailabilityByTechnicianIdFromDB(technicianId as string)
      sendRespons(res, {
          success : true,
          statusCode : httpsStatus.OK,
          message : "Booked availability retrieved successfully!",
          data : result
      })
})

const getFreeAvailabilityByTechnicianId = catchAsync(async( req : Request, res : Response, next : NextFunction) => {
      const {technicianId} = req.body
      const result = await availabilityService.getFreeAvailabilityByTechnicianIdFromDB(technicianId as string)
      sendRespons(res, {
          success : true,
          statusCode : httpsStatus.OK,
          message : "Free availability retrieved successfully!",
          data : result
      })
})

 
export const availabilityController = {
    createAvailability,
    getAllAvailability,
    deleteAvailabilityById,
    getBookedAvailabilityByTechnicianId,
    getFreeAvailabilityByTechnicianId
}
