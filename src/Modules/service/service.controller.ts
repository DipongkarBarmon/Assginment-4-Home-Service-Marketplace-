import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync.js";
import sendRespons from "../../utility/sendResponse.js";
import { serviceService } from "./service.serviec.js";
import httpsStatus from "http-status"

const createService = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
      const result = await serviceService.createServiceIntoDB(req.user.id, req.body);

      sendRespons(res, {
          success : true,
          statusCode : httpsStatus.CREATED,
          message : "Service created successfully!",
          data : result
      })
})

const getAllService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const result = await serviceService.getAllServiceFromDB();
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

const updateServiceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
     const {serviceId} = req.params;
     const result = await serviceService.updateServiceByIdFromDB(serviceId as string, req.body);

     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Service updated successfully!",
        data : result
    })
})

const deleteServiceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
     const {serviceId} = req.params;
     const result = await serviceService.deleteServiceByIdFromDB(serviceId as string);

     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Service deleted successfully!",
        data : result
    })
})  

export const serviceController = {
    createService,
    getServiceById,
    getAllService,
    updateServiceById,
    deleteServiceById

}