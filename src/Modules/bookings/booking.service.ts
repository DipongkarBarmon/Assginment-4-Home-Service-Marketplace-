import { BookingStatus } from "../../../generated/prisma/enums.js"
import { prisma } from "../../lib/prisma.js"

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

     await prisma.availability.update({
        where : {
            id : availabilityId
        },
        data : {
            isBooked : true
        }
     })
       return booking
    })
    return transactionResult
}


const getBookingWithStatusFromDB = async (status : BookingStatus) => {
   
    const booking = await prisma.booking.findMany({
        where : {
           status 
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

const getAllBookingFromDB = async () => {
    const booking = await prisma.booking.findMany({
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


const getUserBookingFromDB = async (userId : string) => {
    const booking = await prisma.booking.findMany({
        where : {
            customerId : userId
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


export const bookingService = {
    createBookingIntoDB,
    getBookingWithStatusFromDB,
    getBookingByIdFromDB,
    getAllBookingFromDB,
    getUserBookingFromDB
}