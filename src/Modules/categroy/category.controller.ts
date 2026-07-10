import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync.js";
import { categoryService } from "./category.service.js";
 
import sendRespons from "../../utility/sendResponse.js";
import httpsStatus from "http-status"



const getAllCategory = catchAsync(async( req : Request, res : Response, next : NextFunction) => { 
      const query = req.query
     const result = await categoryService.getAllCategroyFromDB(query)
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Retrive all category successfully!",
        data : result
      })
})


const getCategoryById = catchAsync(async( req : Request, res : Response, next : NextFunction) => { 
      const {categoryId} = req.params 
     const result = await categoryService.getCategoryByIdfromDB(categoryId as string) 
     console.log(result)
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Retrive category by id successfully!",
        data : result
      })
})

 

export const categoryController = {
    getAllCategory,
    getCategoryById,
  
}