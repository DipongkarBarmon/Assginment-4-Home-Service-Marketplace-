import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync.js";
import { technicianService } from "./technician.service.js";

const createTechnicianProfile = catchAsync(async(req : Request, res : Response, next : NextFunction) => { 
     const userId = req.user?.id;
     const technicianData = req.body;
     const technicianProfile = await technicianService.cteateTechnicianProfileIntoDB(userId!,technicianData);
     res.status(201).json({
        success : true,
        statusCode : 201,
        message : "Technician profile created successfully!",
        data : technicianProfile
     }) 
})

const getTechnicianProfile = catchAsync(async(req : Request, res : Response, next : NextFunction) => {
     const technicianId = req.params.technicianId;
     const technicianProfile = await technicianService.getTechnicianProfileFromDB(technicianId as string);
     res.status(200).json({
        success : true,
        statusCode : 200,
        message : "Technician profile fetched successfully!",
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
     res.status(200).json({
        success : true,
        statusCode : 200,
        message : "Technician profile updated successfully!",
        data : updatedTechnicianProfile
     })
})

const deleteTechnicianProfile = catchAsync(async(req : Request, res : Response, next : NextFunction) => {
     const technicianId = req.params.technicianId;
     await technicianService.deleteTechnicianProfileFromDB(technicianId as string);
     res.status(200).json({
        success : true,
        statusCode : 200,
        message : "Technician profile deleted successfully!",
        data : null
     })
})  

export const technicianController = {
    createTechnicianProfile,
    getTechnicianProfile,
    updateTechnicianProfile,
    deleteTechnicianProfile
}
 