import { AvailabilityWhereInput } from "../../../generated/prisma/models.js";
import { prisma } from "../../lib/prisma.js";
import { IAvailability, IAvailabilityQuery } from "./availability.interface.js";

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


const getAllAvailabilityFromDB = async (query : IAvailabilityQuery) => {

     const limit = query.limit?Number(query.limit) : 10;
     const page = query.page?Number(query.page): 1;
     const skip = (page -1)*limit;
     const sortBy = query.sortBy? query.sortBy : "createdAt";
     const sortOrder = query.sortOrder? query.sortOrder : "desc";
     
     const andCondition : AvailabilityWhereInput[] = []
     
        if(query.isBooked) {
            andCondition.push({
                isBooked : query.isBooked? true : false
            })
        } 
        if(query.technicianId) {
            andCondition.push({
                technicianId : query.technicianId
            })
        }
        if(query.date) {
            andCondition.push({
                date : query.date
            })
        }
        if(query.startTime) {
            andCondition.push({
                startTime : query.startTime 
            })
        }
        if(query.endTime) {
            andCondition.push({
                endTime : query.endTime
              
            })
        }

    const whereCondition : AvailabilityWhereInput = andCondition.length > 0 ? { AND : andCondition } : {}
     
    const availabilities = await prisma.availability.findMany({
        where : whereCondition,
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

 
export const availabilityService = {
    createAvailabilityIntoDB,
    getAllAvailabilityFromDB,
    deleteAvailabilityByIdFromDB,
    
};
 
 