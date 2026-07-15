import e from "express"
import { BookingWhereInput, TechnicianProfileWhereInput } from "../../../generated/prisma/models.js"
import { Booking } from "../../../generated/prisma/browser.js"

export interface ITechnicianProfile {
    bio? : string,
    address : string,
    skills? : string[],
    averageRating? : number,
    completedJobs? : number,
    isVerified? : boolean 
}

export interface IUpdateTechnicianProfile {
    bio? : string,
    address? : string,
    skills? : string[],
    averageRating? : number,
    completedJobs? : number,
    isVerified? : boolean 
} 


export interface ITechnicianProfileQuery extends TechnicianProfileWhereInput {
    searchTerm? : string,
    page ? : string,
    limit? : string,
    sortOrder? : string,
    sortBy? : string
}




export interface ICreateService {
    categoryId : string,
    title : string,
    description? : string,
    price : number,
    duration? : number,
    certificates? : string[],
    experienceYears? : number,
}

 

export interface IUpdateService {
    categoryId? : string,
    title? : string,
    description? : string,
    price? : number,
    duration? : number,
    certificates? : string[],
    experienceYears? : number,
}


export interface IGetAllBookingOfTechnician extends BookingWhereInput {
    page ? : string,
    limit? : string,
    sortOrder? : string,
    sortBy? : string
}