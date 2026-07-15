import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync.js";
import { technicianService } from "./technician.service.js";
import sendRespons from "../../utility/sendResponse.js";
import httpsStatus from "http-status"


const createTechnicianProfile = catchAsync(async(req : Request, res : Response, next : NextFunction) => { 
     const userId = req.user?.id;
     const technicianData = req.body;
     const technicianProfile = await technicianService.cteateTechnicianProfileIntoDB(userId!,technicianData);
     sendRespons(res, {
         success : true,
         statusCode :httpsStatus.CREATED,
         message : "Technician profile created successfully!",
         data : technicianProfile
     })   
})

const getTechnicianProfile = catchAsync(async(req : Request, res : Response, next : NextFunction) => {
     const technicianId = req.params.technicianId;
     const technicianProfile = await technicianService.getTechnicianProfileFromDB(technicianId as string);
       sendRespons(res, {
         success : true,
         statusCode :httpsStatus.OK,
         message : "Technician profile retrieved successfully!",
         data : technicianProfile
     })     
})

const getAllTechnicianProfile = catchAsync(async(req : Request, res : Response, next : NextFunction) => {
     const query = req.query  
     const technicianProfiles = await technicianService.getAllTechnicianProfileFromDB(query);
       sendRespons(res, {
         success : true,
         statusCode :httpsStatus.OK,
         message : "All technician profiles retrieved successfully!",
         data : technicianProfiles
     })     
})

const updateTechnicianProfile = catchAsync(async(req : Request, res : Response, next : NextFunction) => {
     const technicianId = req.params.technicianId;
     const technicianData = req.body;

    if(req.user.role !== "TECHNITIAN") {
        throw new Error("Forbidden! Only technicians can update their profile!")
    }
      
     const updatedTechnicianProfile = await technicianService.updateTechnicianProfileIntoDB(technicianId as string,technicianData);
     sendRespons(res, {
        success : true,
        statusCode :httpsStatus.OK,
        message : "Technician profile updated successfully!",
        data : updatedTechnicianProfile
     }   )
})

const deleteTechnicianProfile = catchAsync(async(req : Request, res : Response, next : NextFunction) => {
     const technicianId = req.params.technicianId;
     await technicianService.deleteTechnicianProfileFromDB(technicianId as string);
     sendRespons(res, {
         success : true, 
         statusCode :httpsStatus.OK,
         message : "Technician profile deleted successfully!",
         data : null
     })
})  

const getOwnTechnicianProfile = catchAsync(async(req : Request, res : Response, next : NextFunction) => { 
        const userId = req.user.userId;
        const technicianProfile = await technicianService.getOwnTechnicianProfileFromDB(userId);
        sendRespons(res, {
            success : true,
            statusCode :httpsStatus.OK,
            message : "Technician profile retrieved successfully!",
            data : technicianProfile
        })     
})



const createService = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
      const result = await technicianService.createServiceIntoDB(req.user.id, req.body);

      sendRespons(res, {
          success : true,
          statusCode : httpsStatus.CREATED,
          message : "Service created successfully!",
          data : result
      })
})


const updateServiceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
     const {serviceId} = req.params;
     const result = await technicianService.updateServiceByIdFromDB(serviceId as string, req.body);

     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Service updated successfully!",
        data : result
    })
})

const deleteServiceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
     const {serviceId} = req.params;
     const result = await technicianService.deleteServiceByIdFromDB(serviceId as string);

     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Service deleted successfully!",
        data : result
    })
}) 




const getAllBookingOfTechnician = catchAsync(async (req: Request, res: Response, next :NextFunction) => {
     const technicianId = req.user.id;
     const query = req.query;
     const bookings = await technicianService.getAllBookingOfTechnicianFromDB(technicianId, query);
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "All bookings of technician retrieved successfully!",
        data : bookings
     }) 
})


const acceptBooking = catchAsync(async (req: Request, res: Response, next :NextFunction) => {
     const bookingId = req.params.bookingId;
     const booking = await technicianService.acceptBookingIntoDB(bookingId as string);
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Booking accepted successfully!",
        data : booking
     }) 
})


const declineBooking = catchAsync(async (req: Request, res: Response, next :NextFunction) => {
     const bookingId = req.params.bookingId;
     const booking = await technicianService.declineBookingIntoDB(bookingId as string);
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Booking declined successfully!",
        data : booking
     }) 
})  

const startWorkingOnBooking = catchAsync(async (req: Request, res: Response, next :NextFunction) => {  
     const bookingId = req.params.bookingId;
     const booking = await technicianService.startWorkingOnBookingIntoDB(bookingId as string);
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Booking started successfully!",
        data : booking
     })  
})

const completeBooking = catchAsync(async (req: Request, res: Response, next :NextFunction) => { 
       const bookingId = req.params.bookingId; 
      const booking = await technicianService.completeBookingIntoDB(bookingId as string);
      sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Booking completed successfully!",
        data : booking
     })     
})

export const technicianController = {
    createTechnicianProfile,
    getTechnicianProfile,
    updateTechnicianProfile,
    deleteTechnicianProfile,
    getOwnTechnicianProfile,
    getAllTechnicianProfile,
    createService,
    updateServiceById,
    deleteServiceById,
    getAllBookingOfTechnician,
    acceptBooking,
    declineBooking,
    startWorkingOnBooking,
    completeBooking
}

 
 