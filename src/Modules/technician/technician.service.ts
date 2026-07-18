import { BookingStatus, TechnicianProfile } from "../../../generated/prisma/browser.js"
import { BookingWhereInput, TechnicianProfileWhereInput } from "../../../generated/prisma/models.js"
import { prisma } from "../../lib/prisma.js"
import { ICreateService, IGetAllBookingOfTechnician, ITechnicianProfile, ITechnicianProfileQuery, IUpdateService, IUpdateTechnicianProfile } from "./technician.interface.js"

const cteateTechnicianProfileIntoDB = async (userId : string, technicianData : ITechnicianProfile) => { 
   const user = await prisma.user.findUniqueOrThrow({
        where : {
            id : userId
        },
        include : {
            technicianProfiles : true
        }
   })

    if(user.technicianProfiles) {
        throw new Error("Technician profile already exists for this user!")     
    }
    
    const technicianProfile = await prisma.technicianProfile.create({
        data : {
            userId,
            ...technicianData
        },
        include : {
            user : {
                omit : {
                    password : true
                }
            },
            services : true,
            reviews : true
        }
    })
    return technicianProfile    
}


const updateTechnicianProfileIntoDB = async (technicianId : string, technicianData : IUpdateTechnicianProfile) => {
    await prisma.technicianProfile.findUniqueOrThrow({
        where : {
            id : technicianId
        }
    })
    
 
    const updatedTechnicianProfile = await prisma.technicianProfile.update({
        where : {
            id : technicianId
        },
        include : {
            user : {
                omit : {
                    password : true
                }
            },
            services : true,
            reviews : true
        },
        data : {
            ...technicianData
        }
    })
    return updatedTechnicianProfile
}

const getTechnicianProfileFromDB = async (technicianId : string) => {
    const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
        where : {
            id : technicianId
        },
        include : {
            user : {
              omit : {
                password : true
              }
            },
            services : true,
            reviews : true
        }
    })
    return technicianProfile
} 

const deleteTechnicianProfileFromDB = async (technicianId : string) => {
    await prisma.technicianProfile.delete({
        where : {
            id : technicianId
        }
    })
    return null
}

const getOwnTechnicianProfileFromDB = async (userId : string) => {


    const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
        where : {
            userId : userId
        },
        include : {
            user : {
                omit : {
                    password : true
                }
            },
            services : true,
            reviews : true
        }
    })
    return technicianProfile
}   


const getAllTechnicianProfileFromDB = async (query : ITechnicianProfileQuery) => {

     const limit = query.limit?Number(query.limit) : 10;
     const page = query.page?Number(query.page): 1;
     const skip = (page -1)*limit;
     const sortBy = query.sortBy? query.sortBy : "createdAt";
     const sortOrder = query.sortOrder? query.sortOrder : "desc";

     const andCondition : TechnicianProfileWhereInput[] = []
     const  skills = query.skills ? JSON.parse(query.skills as string) : null;
     const skillsArray = Array.isArray(skills) ? skills : []

        if(query.searchTerm) {
            andCondition.push({
                OR : [
                    {
                        bio : {
                            contains : query.searchTerm,
                            mode : "insensitive"
                        }
                    },
                    {
                        address : {
                            contains : query.searchTerm,
                            mode : "insensitive"
                        }
                    },
                    {
                        skills : {
                            hasSome : skillsArray
                        }
                    }
                ]
            })
        }

        if(query.isVerified) {
            andCondition.push({
                isVerified : Boolean(query.isVerified)
            })
        }
        if(query.averageRating) {
            andCondition.push({
                averageRating : {
                    gte : Number(query.averageRating)
                }
            })
        }

        if(query.completedJobs) {
            andCondition.push({
                completedJobs : {
                    gte : Number(query.completedJobs)
                }
            })
        }
       
        if(query.userId) {
            andCondition.push({
                userId : query.userId
            })
        }

        if(query.bio) {
            andCondition.push({
                bio : query.bio
            })
        }
                    
        if(query.address) {
            andCondition.push({
                address : query.address
            })
        }

        if(query.skills) {
            andCondition.push({
                skills : {
                    hasSome : skillsArray
                }
            })
        }

     const whereCondition : TechnicianProfileWhereInput = andCondition.length > 0 ? { AND : andCondition } : {}
      
        const technicianProfiles = await prisma.technicianProfile.findMany({
            where : whereCondition,

            take : limit,
            skip : skip,
            orderBy : {
                [sortBy] : sortOrder
            },
            include : {
                user : {
                    omit : {
                        password : true
                    }
                },
                services : {
                     include : {
                        category : true
                        } 
                },
                reviews : true
            }
        })
        return technicianProfiles;

}



const createServiceIntoDB = async (userId : string, serviceData : ICreateService) => {
      const user = await prisma.user.findUniqueOrThrow({
        where : {
            id : userId
        },include : {
            technicianProfiles : {
               include : {
                  services : true
            
               }
            }
        }
      })

      if(!user.technicianProfiles) {
        throw new Error("Technician profile does not exist for this user!")     
      }
     
      await prisma.category.findUniqueOrThrow({
        where: {
        id:serviceData.categoryId,
        },
      });

        const existingService = await prisma.service.findFirst({
            where: {
                technicianId: user.technicianProfiles.id,
                categoryId: serviceData.categoryId,
                title: {
                    equals: serviceData.title,
                    mode: "insensitive"
                }
            }
        });

        if (existingService) {
           throw new Error("This service already exists in this category.");
        }

    //   console.log("Hello")
      
      const technicianProfileId = user.technicianProfiles.id;
    
    //  console.log("Technician Profile ID:", technicianProfileId); // Log the technician profile ID to verify it's being retrieved correctly
      const createdService = await prisma.service.create({
        data : {
             technicianId : technicianProfileId,
            ...serviceData
        },
        include : { 
          technician : {
            include : {
                user : {  
                  omit : {
                    password : true
                  }
                }
            }
          },  
           category : true  
        }
      })

      return createdService;  
}


const updateServiceByIdFromDB = async(id : string, updateData : IUpdateService) => {
    await prisma.service.findUniqueOrThrow({
        where : {
            id
        }
    })

    const result = await prisma.service.update({
        where : {
            id
        },
        data : updateData,
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

                },
                
            },
            bookings : true
        }
    })
    return result;
}

const deleteServiceByIdFromDB = async(id : string) => {
    await prisma.service.findUniqueOrThrow({
        where : {
            id
        }
    })

    const result = await prisma.service.delete({
       where : {
         id
       },
       include : {
          category :true,   
          technician : {
            include : {
                user : {
                    omit : {
                        password : true
                    }
                },
                reviews : true
            },
             
          },
          bookings : true
       }
    })
    return result;
}




const getAllBookingOfTechnicianFromDB = async (technicianId : string, query :IGetAllBookingOfTechnician    ) => {
     
     const limit = query.limit?Number(query.limit) : 10;
     const page = query.page?Number(query.page): 1;
     const skip = (page -1)*limit;
     const sortBy = query.sortBy? query.sortBy : "createdAt";
     const sortOrder = query.sortOrder? query.sortOrder : "desc";

    const andCondition : BookingWhereInput[] = []   
    
    if(query.status) {
        andCondition.push({
            status : query.status as BookingStatus
        })
    }

    if(query.customerId) {
        andCondition.push({
            customerId : query.customerId
        })
    }

    if(query.serviceId) {
        andCondition.push({
            serviceId : query.serviceId
        })
    }

    if(query.availabilityId) {
        andCondition.push({
            availabilityId : query.availabilityId
        })
    }

    if(query.technicianId) {
        andCondition.push({
            technicianId : query.technicianId
        })
    }

     const whereCondition : BookingWhereInput = andCondition.length > 0 ? { AND : andCondition } : {}
      
     const bookings = await prisma.booking.findMany({
         where : {
            technicianId,
            ...whereCondition
         },
         take : limit,
         skip : skip,
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
                        }
                    },
                    availabilities : true,
                    reviews : true
                }
            }
         }
     })
     return bookings;   
    
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
        id: booking.availabilityId!,
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

        if(booking.status !== BookingStatus.PAID){
            throw new Error("Booking is not in paid status!")
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


export const technicianService = {
    cteateTechnicianProfileIntoDB,
    updateTechnicianProfileIntoDB,
    getTechnicianProfileFromDB,
    deleteTechnicianProfileFromDB,
    getOwnTechnicianProfileFromDB,
    getAllTechnicianProfileFromDB,
    createServiceIntoDB,
    updateServiceByIdFromDB,
    deleteServiceByIdFromDB,
   getAllBookingOfTechnicianFromDB,
    acceptBookingIntoDB,
    declineBookingIntoDB,
    startWorkingOnBookingIntoDB,
    completeBookingIntoDB
} 
