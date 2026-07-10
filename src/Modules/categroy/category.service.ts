import { CategoryWhereInput } from "../../../generated/prisma/models.js";
import { prisma } from "../../lib/prisma.js";
import { categoryQuery } from "./category.interface.js";
 

const getAllCategroyFromDB = async(query: categoryQuery) => {

     const limit = query.limit?Number(query.limit) : 10;
     const page = query.page?Number(query.page): 1;
     const skip = (page -1)*limit;
     const sortBy = query.sortBy? query.sortBy : "createdAt";
     const sortOrder = query.sortOrder? query.sortOrder : "desc";

     const andCondition : CategoryWhereInput[] = []

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
                        description : {
                            contains : query.searchTerm,
                            mode : "insensitive"
                        }
                    }
                ]
            })
        }
        
        if(query.name) {
            andCondition.push({
                name : query.name
            })
        }
        if(query.description) {
            andCondition.push({
                description : query.description
            })
        }

    const whereCondition : CategoryWhereInput = andCondition.length > 0 ? { AND : andCondition} : {}   
    
    
    const result = await prisma.category.findMany({
        where : whereCondition,
        skip,
        take : limit,
        orderBy : {
            [sortBy] : sortOrder
        },
        include : {
            services : {
                include : { 
                     technician  : {
                        include : {
                            user : {
                                omit : {
                                    password : true
                                }
                            },  
                            reviews : true
                        }
                     }
                }
            }
        }   
    })

    return result   
}


const getCategoryByIdfromDB = async(id : string) => {

   const result = await prisma.category.findUniqueOrThrow({
     where : {
       id
     },
     include : {
       services : {
            include : {
                technician  : {
                    include : {
                        user : {
                            omit : {
                                password : true
                            }
                        },  
                        reviews : true
                    }
                }
            }       
       }
     }
   })
   return result
}

export const categoryService = {
   
    getAllCategroyFromDB,
   getCategoryByIdfromDB,
  
} 