import { prisma } from "../../lib/prisma.js"
import { ICreateService, ITechnicianProfile, IUpdateService, IUpdateTechnicianProfile } from "./technician.interface.js"

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
    createServiceIntoDB,
    updateServiceByIdFromDB,
    deleteServiceByIdFromDB
} 
