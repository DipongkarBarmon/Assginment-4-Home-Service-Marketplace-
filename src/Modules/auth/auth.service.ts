import { SignOptions } from "jsonwebtoken"
import config from "../../config/index.js"
import { prisma } from "../../lib/prisma.js"
import { jwtToken } from "../../utility/jwtToken.js"
import { ILoginUser, IUser } from "./auth.interface.js"
import bcrypt from 'bcrypt'

const userRegisterIntoDB = async(payload : IUser) => {
    const {name, email, password,phoneNumber, profilePhoto,role , status} = payload
    const isUserExist = await prisma.user.findUnique({
        where :{
          email
        }
       })

       if (isUserExist) {
         throw new Error("User all ready exists!")
       }

       const hashPassword =  await bcrypt.hash(password,Number(config.bcrypt_salt_rounds))

       if(!hashPassword) {
         throw new Error("Problem in hashing password!")
       }
       
       const createdUser = await prisma.user.create({
          data : {
             name,
             email,
             password : hashPassword,
             phoneNumber,
             profilePhoto ,
             role ,
             status 
          }
       })
  
      const user = await prisma.user.findUniqueOrThrow({
          where : {
            id : createdUser.id,
            email : createdUser.email || email
          },
          omit :{
              password : true
          },
          include : {
             technicianProfiles: true,
             bookings: true,
             reviews : true
          }
        })


       return user

}

const userLoginFromBD = async(payload : ILoginUser) => {

   const {email, password} = payload
   
    const user = await prisma.user.findUniqueOrThrow({
      where : {
         email
      }
    })

    const matchPassword = await bcrypt.compare(password, user.password)

    if(!matchPassword) {
       throw new Error("Invaild credentails!")
    }

    const jwtPayload = {
       id : user.id,
       email : user.email,
       name : user.name,
       role : user.role
    }

   const accessToken = jwtToken.jwtTokenCreate(
      jwtPayload ,
      config.jwt_accress_token,
      config.jwt_access_expires_in as SignOptions
   )

    const refreshToken = jwtToken.jwtTokenCreate(
        jwtPayload,
        config.jwt_refresh_token,
        config.jwt_refresh_expires_in as SignOptions
    )
    return {accessToken, refreshToken}

}

export const authService = {
  userRegisterIntoDB,
  userLoginFromBD
}