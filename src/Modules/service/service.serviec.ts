import { prisma } from "../../lib/prisma.js";
 



const getAllServiceFromDB = async() => {
    const result = await prisma.service.findMany({
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
          
 