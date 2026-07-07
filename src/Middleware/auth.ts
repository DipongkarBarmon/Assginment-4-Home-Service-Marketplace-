import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums.js";
import config from "../config/index.js";
import { prisma } from "../lib/prisma.js";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../utility/catchAsync.js";
import { jwtToken } from "../utility/jwtToken.js";
 

export const auth = (...roles : Role[]) => {
      return catchAsync( async(req : Request, res : Response, next : NextFunction) => {
          const token = req.cookies.accessToken ? req.cookies.accessToken
           : req.headers.authorization?.startsWith("Bearer ")? req.headers.authorization?.split(" ")[1] : req.headers.authorization;
          if (!token) {
             throw new Error("Unauthorized access!! Please login to access this resource!")
          } 

          const decodeToken   = jwtToken.jwtTokenVarify(token!,config.jwt_accress_token)
         
          if(!decodeToken.success) {
               throw new Error(decodeToken.error)
          }
     
          const payload = decodeToken.data as JwtPayload
          
          const user = await prisma.user.findUniqueOrThrow({
             where : {
               email : payload.email
             }
          })

          if(!user) {
              throw new Error("User not found! Please login again!")
          }
          
          if(user.status === "BLOCKED") {
             throw new Error("Your account has been blocked. Please contact support!")
          }
          
          if(roles.length && !roles.includes(user.role)) {
             throw new Error("Forbidden! This role have no access!") 
          }
          
          req.user = payload;

          next();

      })
}

