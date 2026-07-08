import { prisma } from "../../lib/prisma.js";
import { IUpdateCategory } from "../categroy/category.interface.js";
import { ICreateService, IUpdateService } from "./service.interface.js";

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

export const serviceService = {
    createServiceIntoDB,
    getAllServiceFromDB,
    getServiceByIdFromDB,
    updateServiceByIdFromDB,
    deleteServiceByIdFromDB
}   
          
 