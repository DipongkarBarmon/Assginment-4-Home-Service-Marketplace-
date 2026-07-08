import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync.js";
import { categoryService } from "./category.service.js";
 
import sendRespons from "../../utility/sendResponse.js";
import httpsStatus from "http-status"


const createCategory = catchAsync(async( req : Request, res : Response, next : NextFunction) => {
  
     const result = await categoryService.createCategoryIntoDB(req.body);
      sendRespons(res, {
          success : true,
          statusCode : httpsStatus.CREATED,
          message : "Category created successfully!",
          data : result
      })
})

const getAllCategory = catchAsync(async( req : Request, res : Response, next : NextFunction) => { 

     const result = await categoryService.getAllCategroyFromDB()
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

const updateCategoryById = catchAsync(async( req : Request, res : Response, next : NextFunction) => {
      const {categoryId} = req.params 
      const result = await categoryService.updateCategoryByIdFromDB(categoryId as string,req.body)
      sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Category updated successfully!",
        data : result
      })  
})

const deleteCategoryById = catchAsync(async( req : Request, res : Response, next : NextFunction) => {
      const {categoryId} = req.params 
      await categoryService.deleteCategoryByIdFromDB(categoryId as string)
      sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "Category deleted successfully!",
        data : null
      })
})  

export const categoryController = {
    createCategory,
    getAllCategory,
    getCategoryById,
    deleteCategoryById,
    updateCategoryById
}