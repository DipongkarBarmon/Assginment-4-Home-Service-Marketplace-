import { prisma } from "../../lib/prisma.js"
import { ITechnicianProfile, IUpdateTechnicianProfile } from "./technician.interface.js"

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

export const technicianService = {
    cteateTechnicianProfileIntoDB,
    updateTechnicianProfileIntoDB,
    getTechnicianProfileFromDB,
    deleteTechnicianProfileFromDB,
    getOwnTechnicianProfileFromDB
} 
