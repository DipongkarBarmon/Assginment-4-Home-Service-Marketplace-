import { BookingStatus } from "../../../generated/prisma/enums.js"
import { BookingWhereInput } from "../../../generated/prisma/models.js"
import { prisma } from "../../lib/prisma.js"
import { IGETBooking } from "./booking.interface.js"

const createBookingIntoDB = async (userId: string, serviceId: string, availabilityId: string) => {
     
    const transactionResult = await prisma.$transaction(async (prisma) => { 

      await prisma.user.findUniqueOrThrow({
        where : {
            id : userId
        }
     })

     const service = await prisma.service.findUniqueOrThrow({
        where : {
            id : serviceId
        }
     })

     const availability = await prisma.availability.findUniqueOrThrow({
        where : {
            id : availabilityId
        }
     })

     if(availability.isBooked){
        throw new Error("This availability is already booked!")
     }
      
      await prisma.availability.update({
        where : {
            id : availabilityId
        },
        data : {
            isBooked : true
        }
     })
     
     const booking = await prisma.booking.create({
        data : {
            customerId : userId,
            technicianId : service.technicianId,
            serviceId,
            availabilityId,
            price : service.price
        },
        include : {
           technician : {
            include : {
                user : {
                    omit : {
                        password : true
                    }
                },
                services : {
                   include : {
                      category : true
                   },
                },
                availabilities : true,
                reviews : true

            },
          
           }
        }
     })

    
       return booking
    })
    return transactionResult
}
 

const getBookingByIdFromDB = async (bookingId : string) => {
    const booking = await prisma.booking.findUniqueOrThrow({
        where : {
            id : bookingId
        },
        include : {
           technician : {
            include : {
                user : {
                    omit : {
                        password : true
                    }
                },
                services : {
                   include : {
                      category : true
                   },
                },
                availabilities : true,
                reviews : true

            },
          
           }
        }
     })
     return booking
}
 


const getUserBookingFromDB = async (userId : string, query: IGETBooking) => {
    
     const limit = query.limit?Number(query.limit) : 10;
     const page = query.page?Number(query.page): 1;
     const skip = (page -1)*limit;
     const sortBy = query.sortBy? query.sortBy : "createdAt";
     const sortOrder = query.sortOrder? query.sortOrder : "desc";
     const andCondition : BookingWhereInput[] = []

     if(query.status){
        andCondition.push({
            status : query.status
        })
     }

     if(query.createdAt){
        andCondition.push({
            createdAt : query.createdAt
        })
     }
     
     if(query.technicianId){
        andCondition.push({
            technicianId : query.technicianId
        })
     }
     if(query.serviceId){
        andCondition.push({
            serviceId : query.serviceId
        })
     } 

     if(query.availabilityId){
        andCondition.push({
            availabilityId : query.availabilityId
        })
     }
     
     if(query.customerId){
        andCondition.push({
            customerId : query.customerId
        })
     }

     const whereCondition : BookingWhereInput = andCondition.length > 0 ? { AND : andCondition } : {}   

    
    const booking = await prisma.booking.findMany({
        where : {
            customerId : userId,
            ...whereCondition
        },
        skip,
        take : limit,
        orderBy : {
            [sortBy] : sortOrder
        },
        include : {
           technician : {
            include : {
                user : {
                    omit : {
                        password : true
                    }
                },
                services : {
                   include : {
                      category : true
                   },
                },
                availabilities : true,
                reviews : true

            },
          
           }
        }
     })
     return booking
}         


const cancelBookingIntoDB = async (bookingId: string) => {
    const transactionResult = await prisma.$transaction(async (prisma) => {
        const booking = await prisma.booking.findUniqueOrThrow({
            where : {
                id : bookingId
            }
        })

        if(booking.status !== BookingStatus.REQUESTED && booking.status !== BookingStatus.ACCEPTED){
            throw new Error("Booking cannot be cancelled at this stage!")
        }

        await prisma.availability.update({
            where : {
                id : booking.availabilityId!
            },
            data : {
                isBooked : false
            }
        })

        await prisma.booking.update({
            where : {
                id : bookingId
            },
            data : {
                status : BookingStatus.CANCELLED,
                availabilityId : null
            }
        })

    

        const updatedBooking = await prisma.booking.findUniqueOrThrow({
            where : {
                id : bookingId
            },
            include : {
                technician : {
                 include : {
                     user : {
                         omit : {
                             password : true
                         }
                     },
                     services : {
                        include : {
                           category : true
                        },
                     },
                     availabilities : true,
                     reviews : true
 
                 },
               
                }
             }  
        })

        return updatedBooking
    })

    return transactionResult
}
  
export const bookingService = {
    createBookingIntoDB,
    getBookingByIdFromDB,
    getUserBookingFromDB, 
    cancelBookingIntoDB,
     
     
}