import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync.js";
import { technicianService } from "./technician.service.js";
import { send } from "node:process";
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

export const technicianController = {
    createTechnicianProfile,
    getTechnicianProfile,
    updateTechnicianProfile,
    deleteTechnicianProfile,
    getOwnTechnicianProfile
}

 
 