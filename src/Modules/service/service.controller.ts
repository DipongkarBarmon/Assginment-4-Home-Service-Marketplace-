import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync.js";

const createService = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
      
})


export const serviceController = {
    createService
}