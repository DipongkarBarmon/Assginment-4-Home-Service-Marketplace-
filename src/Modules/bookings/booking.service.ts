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

const acceptBookingIntoDB = async (bookingId : string) => {
    const transactionResult = await prisma.$transaction(async (prisma) => {
        const booking = await prisma.booking.findUniqueOrThrow({
            where : {
                id : bookingId
            }
        })    

        if(booking.status !== BookingStatus.REQUESTED){
            throw new Error("Booking is not in requested status!")
        }

        const updatedBooking = await prisma.booking.update({
            where : {
                id : bookingId
            },
            data : {
                status : BookingStatus.ACCEPTED
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

const declineBookingIntoDB = async (bookingId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUniqueOrThrow({
      where: {
        id: bookingId,
      },
    });

    if (booking.status !== BookingStatus.REQUESTED) {
      throw new Error("Booking is not in requested status!");
    }

    await tx.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: BookingStatus.DECLINED,
      },
    });

    
    await tx.availability.update({
      where: {
        id: booking.availabilityId,
      },
      data: {
        isBooked: false,
      },
    });

   
    const updatedBooking = await tx.booking.findUniqueOrThrow({
      where: {
        id: bookingId,
      },
      include: {
        technician: {
          include: {
            user: {
              omit: {
                password: true,
              },
            },
            services: {
              include: {
                category: true,
              },
            },
            availabilities: true,
            reviews: true,
          },
        },
      },
    });

    return updatedBooking;
  });

  return transactionResult;
};

const startWorkingOnBookingIntoDB = async (bookingId: string) => {
    const transactionResult = await prisma.$transaction(async (prisma) => {
        const booking = await prisma.booking.findUniqueOrThrow({
            where : {
                id : bookingId
            }
        })

        if(booking.status !== BookingStatus.ACCEPTED){
            throw new Error("Booking is not in accepted status!")
        }

        const updatedBooking = await prisma.booking.update({
            where : {
                id : bookingId
            },
            data : {
                status : BookingStatus.IN_PROGRESS
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


const completeBookingIntoDB = async (bookingId: string) => {
    const transactionResult = await prisma.$transaction(async (prisma) => {
        const booking = await prisma.booking.findUniqueOrThrow({
            where : {
                id : bookingId
            }
        })

        if(booking.status !== BookingStatus.IN_PROGRESS){
            throw new Error("Booking is not in progress status!")
        }
        
        await prisma.technicianProfile.update({
            where : {
                id : booking.technicianId
            },
            data : {
                completedJobs : {
                    increment : 1
                }   
            }
        })

        

        const updatedBooking = await prisma.booking.update({
            where : {
                id : bookingId
            },
            data : {
                status : BookingStatus.COMPLETED
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

        await prisma.booking.update({
            where : {
                id : bookingId
            },
            data : {
                status : BookingStatus.CANCELLED
            }
        })

        await prisma.availability.update({
            where : {
                id : booking.availabilityId
            },
            data : {
                isBooked : false
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

const getBookingByTechnicianIdWithStatusFromDB = async (technicianId : string,status : BookingStatus) => {

    await prisma.technicianProfile.findUniqueOrThrow({
        where : {
            id : technicianId
        }
     }) 

    const booking = await prisma.booking.findMany({
        where : {
            technicianId,
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
export const bookingService = {
    createBookingIntoDB,
    getBookingWithStatusFromDB,
    getBookingByIdFromDB,
    getAllBookingFromDB,
    getUserBookingFromDB,
    acceptBookingIntoDB,
    declineBookingIntoDB,
    startWorkingOnBookingIntoDB,
    completeBookingIntoDB,
    cancelBookingIntoDB,
    getBookingByTechnicianIdWithStatusFromDB,
     
}