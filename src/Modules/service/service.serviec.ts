import { ServiceWhereInput } from "../../../generated/prisma/models.js";
import { prisma } from "../../lib/prisma.js";
import { IServiceQuery } from "./service.interface.js";
 



const getAllServiceFromDB = async(query: IServiceQuery) => {

     const limit = query.limit?Number(query.limit) : 10;
     const page = query.page?Number(query.page): 1;
     const skip = (page -1)*limit;
     const sortBy = query.sortBy? query.sortBy : "createdAt";
     const sortOrder = query.sortOrder? query.sortOrder : "desc";

     const andCondition : ServiceWhereInput[] = []
 
    const certificates = query.certificates ? JSON.parse(query.certificates as string) : null;
     
     const certificteArray = Array.isArray(certificates) ? certificates : []

     if(query.searchTerm){ 
         andCondition.push({
              OR : [
                {
                    title : {
                        contains : query.searchTerm,
                        mode : "insensitive"
                    }
                },
                {
                    description : {
                        contains : query.searchTerm,
                        mode : "insensitive"
                    }
                },
                {
                    certificates : {
                        hasSome : certificteArray
                    }
                }
              ] 
         }) 
     }
    
     if(query.price) {
        andCondition.push({
            price :  query.price
        })
     }

     if(query.categoryId) {
        andCondition.push({
            categoryId : query.categoryId
        })
     }

     if(query.technicianId) {
        andCondition.push({
            technicianId : query.technicianId
        })
     }

     if(query.duration) {
        andCondition.push({
            duration : query.duration
        })
     }

     if(query.experienceYears) {
        andCondition.push({
            experienceYears : query.experienceYears
        })
     }  

     if(query.title) {
        andCondition.push({
            title : query.title
        })
     }

     if(query.description) {
        andCondition.push({
            description : query.description
        })
     }
     if(query.isActive) {
        andCondition.push({
            isActive : query.isActive? true : false
        })
     }
      
     if(query.certificates) {
        andCondition.push({
            certificates : {
                hasSome : certificteArray
            }
        })
     }
     const whereCondition : ServiceWhereInput = andCondition.length > 0 ? { AND : andCondition } : {}

            
    const result = await prisma.service.findMany({
        where : whereCondition,
        skip,
        take : limit,
        orderBy : {
            [sortBy] : sortOrder
        },
       include : {
          category : true, 
          technician : {
            include : {
                user : {
                    omit : {
                        password : true
                    }
                },
                reviews : true
            }
          },
          bookings : true,
          

       }
    })
    return result;
}

const getServiceByIdFromDB = async(id : string) => {
   const result = await prisma.service.findUniqueOrThrow({
     where : {
       id
     },
     include : {
        category : true,
        technician : {
            include : {
                user : {
                    omit : {
                        password : true
                    }
                },
                reviews : true
            }
        },
        bookings : true
     }
   })
   return result
}



export const serviceService = {
 
    getAllServiceFromDB,
    getServiceByIdFromDB,
    
}   
          
 