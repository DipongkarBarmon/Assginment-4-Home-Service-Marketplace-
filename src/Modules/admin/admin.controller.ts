import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync.js";
import { adminService } from "./admin.service.js";
import sendRespons from "../../utility/sendResponse.js";
import httpsStatus from "http-status"
import { User, userStatus } from "../../../generated/prisma/browser.js";

const getAllUsers = catchAsync(async (req: Request, res: Response,next: NextFunction) => { 
     const query = req.query
     console.log(query) 
     const  users = await adminService.getAllUsersFromDB(query);
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "All users retrieved successfully!",
        data : users
     }) 

})

const getUserById = catchAsync(async (req: Request, res: Response,next: NextFunction) => {
      const userId = req.query.userId
      const  user = await adminService.getUserByIdFromDB(userId as string); 
      sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "User retrieved successfully!",
        data : user
     }) 
})

const updateUserStatus = catchAsync(async (req: Request, res: Response,next: NextFunction) => {
     const {userId,status} = req.query
  
     const  user = await adminService.updateUserStatusInDB(userId as string, status as userStatus);

     sendRespons(res, {
       success : true,
       statusCode : httpsStatus.OK,
       message : "User status updated successfully!",
       data : user
    }) 
})

const deleteUserById = catchAsync(async (req: Request, res: Response,next: NextFunction) => {
     const userId = req.query.userId
     await adminService.deleteUserProfileFromDB(userId as string);

     sendRespons(res, {
       success : true,
       statusCode : httpsStatus.OK,
       message : "User deleted successfully!",
       data : null
    }) 
})
export const adminController = {
    getAllUsers,
    getUserById,
    updateUserStatus,
    deleteUserById
}
 