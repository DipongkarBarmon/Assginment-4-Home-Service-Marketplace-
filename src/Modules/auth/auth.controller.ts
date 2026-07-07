import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync.js";
import { authService } from "./auth.service.js";
import sendRespons from "../../utility/sendResponse.js";
import httpsStatus from 'http-status'

const userRegister = catchAsync(async(req : Request, res : Response, next : NextFunction) => {
     const result = await authService.userRegisterIntoDB(req.body)
     sendRespons(res, {
        success : true,
        statusCode : httpsStatus.OK,
        message : "User crated successfully!",
        data : {
          result
        }
     })
})

const userLogin = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{
      const {accessToken, refreshToken} = await authService.userLoginFromBD(req.body);
       res.cookie("accessToken",accessToken,{
          secure : false,
          httpOnly : true,
          sameSite : "lax",
          maxAge : 1000*60*60*24  // 1d

      })
      res.cookie("refreshToken",refreshToken,{
          secure : false,
          httpOnly : true,
          sameSite : "lax",
          maxAge : 1000*60*60*24  // 1d

      })

       sendRespons(res, {
          success : true,
          statusCode : httpsStatus.OK, 
          message : "User login successfully!",
          data : {
            accessToken,
            refreshToken
         }
      })
   
})


const refreshToken = catchAsync(async( req : Request,res: Response,next : NextFunction) => {
      const token = req.cookies.refreshToken;
      console.log(token)
      const accessToken = await authService.refreshTokenFromDB(token)
      
      res.cookie("accessToken",accessToken, {
         secure : false,
         httpOnly : true,
         sameSite :"lax",
         maxAge : 1000*60*60*24
      })
      
      sendRespons(res, {
          success : true,
          statusCode : httpsStatus.OK,
          message : "Token refreshed successfully",
          data : accessToken
          
      })
})


export const authController = {
   userRegister,
   userLogin,
   refreshToken
}