import { Role, userStatus } from "../../../generated/prisma/enums.js"


export interface IUser {
  name :string,
  email :  string,
  password : string,
  phoneNumber : string,
  profilePhoto? : string
  role?: Role,
  status? : userStatus

}

export interface ILoginUser  {
   email : string,
   password : string

}