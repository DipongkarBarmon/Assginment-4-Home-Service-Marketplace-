import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync.js";
import sendRespons from "../../utility/sendResponse.js";
import { serviceService } from "./service.serviec.js";
import httpsStatus from "http-status"



const getAllService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
      const result = await serviceService.getAllServiceFromDB( query);
      sendRespons(res, { 
          success : true,
          statusCode : httpsStatus.OK,
          message : "All service retrieved successfully!",
          data : result
      })
})

const getServiceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
     const {serviceId} = req.params;
    const result = await serviceService.getServiceByIdFromDB(serviceId as string);  

    sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Service retrieved successfully!",
        data : result
    })
})

 

export const serviceController = {
 
    getServiceById,
    getAllService,
 

}