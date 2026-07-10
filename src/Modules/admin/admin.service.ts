import { userStatus } from "../../../generated/prisma/enums.js";
import { UserWhereInput } from "../../../generated/prisma/models.js";
import { prisma } from "../../lib/prisma.js";
import { IUserQuery } from "./admin.interface.js"

const getAllUsersFromDB = async(query: IUserQuery) => {
     const limit = query.limit?Number(query.limit) : 5;
     const page = query.page?Number(query.page): 1;
     const skip = (page-1)*limit;
     const sortBy = query.sortBy? query.sortBy : "createdAt";
     const sortOrder = query.sortOrder? query.sortOrder : "desc";

     const andCondition : UserWhereInput[] = []

     if(query.searchTerm) {
        andCondition.push({
            OR : [
                {
                    name : {
                        contains : query.searchTerm,
                        mode : "insensitive"
                    }
                },
                {
                    email : {
                        contains : query.searchTerm,
                        mode : "insensitive"
                    }
                },
                {
                    phoneNumber : {
                        contains : query.searchTerm,
                        mode : "insensitive"
                    }
                }
            ]
        })
     }

     if(query.role) {
        andCondition.push({
            role : query.role
        })
     }

     if(query.status) {
        andCondition.push({
            status : query.status
        })
     }
     if(query.name) {
        andCondition.push({
            name : query.name
        })
     }
     if(query.email) {
        andCondition.push({
            email : query.email
        })
     }
      if(query.phoneNumber) {
          andCondition.push({
              phoneNumber : query.phoneNumber
          })
      } 
     const whereCondition : UserWhereInput = andCondition.length > 0 ? { AND: andCondition } : {}

     const users = await prisma.user.findMany({
        where : {
          AND : whereCondition
        },
        orderBy : {
            [sortBy] : sortOrder
        },
        take : limit,
        skip : skip,
        omit : {
            password : true
        }
     })

     return users 

}

const getUserByIdFromDB = async(userId : string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where : {
            id : userId
        },
        omit : {
            password : true
        }
    })

    return user
} 

const updateUserStatusInDB = async(userId : string, status : userStatus) => {

    const user = await prisma.user.findUniqueOrThrow({
        where : {
            id : userId
        }
    })  

    if(status !== userStatus.ACTIVE && status !== userStatus.BLOCKED) {
        throw new Error("Invalid status value!")
    }

    
    if(user.status === status) {
        throw new Error(`User is already ${status}!`)
    } 

    const updatedUser = await prisma.user.update({
        where : {
            id : userId
        },
        data : {
            status : status
        },
        omit : {
            password : true
        }
    })

    return updatedUser
}

const deleteUserProfileFromDB = async(userId : string) => {
    
    const user = await prisma.user.findUniqueOrThrow({
        where : {
            id : userId
        }
    })

    if(user.role === "ADMIN") {
        throw new Error("Admin profile cannot be deleted!")
    }

    await prisma.user.delete({
        where : {
            id : userId   
        }
    })

    return null
} 

export const adminService = {
    getAllUsersFromDB,
    getUserByIdFromDB,
    updateUserStatusInDB,
    deleteUserProfileFromDB
}
 