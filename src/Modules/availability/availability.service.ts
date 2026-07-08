import { prisma } from "../../lib/prisma.js";
import { IAvailability } from "./availability.interface.js";

const createAvailabilityIntoDB = async (userId: string, availabilityData: IAvailability) => {
  
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        include: {
           technicianProfiles: true   
        }
    });

    if(!user.technicianProfiles)  {
       throw new Error("Technician profile not found for the user.");
    }

    const technicianProfile = user.technicianProfiles;
    
    const technicianId = technicianProfile.id;

    const overlappingAvailability = await prisma.availability.findFirst({
        where: {
            technicianId,
            OR: [
                {
                    startTime: {
                        lte: availabilityData.endTime
                    },
                    endTime: {
                        gte: availabilityData.startTime
                    }
                }
            ]
        }
    });

    if (overlappingAvailability) {
        throw new Error("The specified availability overlaps with existing availability.");
    }

    const createdAvailability = await prisma.availability.create({
        data: {
            technicianId,
            ...availabilityData
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
                    reviews : true,
                    bookings : true
                }
            }
        } 

    });
    return createdAvailability;
};


const getAllAvailabilityFromDB = async () => {
 
    const availabilities = await prisma.availability.findMany({
     
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
                    reviews : true,
                    bookings : true
                }
            }
        } 
    });

    return availabilities;
};

 
const deleteAvailabilityByIdFromDB = async (availabilityId: string) => {
    await prisma.availability.findUniqueOrThrow({
        where: {
            id: availabilityId
        }
    });

    await prisma.availability.delete({
        where: {
            id: availabilityId
        }
    });
    return null
};

const getBookedAvailabilityByTechnicianIdFromDB = async (technicianId: string) => {
     await prisma.technicianProfile.findUniqueOrThrow({
        where : {
            id : technicianId
        }
     })

      const bookedAvailabilities = await prisma.availability.findMany({ 
          where : {
              technicianId,
              isBooked : true
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
                    reviews : true,
                    bookings : true
                } 
            }
          },
          orderBy : [
             {
               date : "asc"
             },
             {
               startTime : "asc"
             }
          ]  
        
      })
      return bookedAvailabilities;
}

const getFreeAvailabilityByTechnicianIdFromDB = async (technicianId: string) => {
    await prisma.technicianProfile.findUniqueOrThrow({
       where : {
           id : technicianId
       }
    })

     const freeAvailabilities = await prisma.availability.findMany({
         where : {
             technicianId,
             isBooked : false
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
                    reviews : true,
                    bookings : true
               } 
           }
         },
         orderBy : [
            {
              date : "asc"
            },
            {
              startTime : "asc"
            } 
         ]
     })
     return freeAvailabilities;
 }  

export const availabilityService = {
    createAvailabilityIntoDB,
    getAllAvailabilityFromDB,
    deleteAvailabilityByIdFromDB,
    getBookedAvailabilityByTechnicianIdFromDB,
    getFreeAvailabilityByTechnicianIdFromDB
};
 
 