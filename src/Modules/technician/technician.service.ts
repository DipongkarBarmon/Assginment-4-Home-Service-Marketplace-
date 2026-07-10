import { TechnicianProfile } from "../../../generated/prisma/browser.js"
import { TechnicianProfileWhereInput } from "../../../generated/prisma/models.js"
import { prisma } from "../../lib/prisma.js"
import { ICreateService, ITechnicianProfile, ITechnicianProfileQuery, IUpdateService, IUpdateTechnicianProfile } from "./technician.interface.js"

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
                isVerified : query.isVerified? true : false
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

     const exists = user.technicianProfiles.services.some(
        (service) => service.categoryId === serviceData.categoryId
      );

      if (exists) {
        throw new Error("A service with this category already exists.");
      }
      
      const technicianProfile = user.technicianProfiles;
    

      const createdService = await prisma.service.create({
        data : {
             technicianId : technicianProfile.id,
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

export const technicianService = {
    cteateTechnicianProfileIntoDB,
    updateTechnicianProfileIntoDB,
    getTechnicianProfileFromDB,
    deleteTechnicianProfileFromDB,
    getOwnTechnicianProfileFromDB,
    getAllTechnicianProfileFromDB,
    createServiceIntoDB,
    updateServiceByIdFromDB,
    deleteServiceByIdFromDB
} 
