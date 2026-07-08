import { prisma } from "../../lib/prisma.js";
import { ICreateCategory, IUpdateCategory } from "./category.interface.js"

const createCategoryIntoDB = async (categoryData : ICreateCategory) => {
      const { name, icon, description } = categoryData;
       
      const createdCategory = await prisma.category.create({
        data: {
          name,
          icon,
          description,
        },
        include: {
          services: true,
         },  
      });

      return createdCategory;
}

 
const getAllCategroyFromDB = async() => {
    const result = await prisma.category.findMany({
       include : {
          services : true
       }
    })
    return result;
}

const getCategoryByIdfromDB = async(id : string) => {
   const result = await prisma.category.findUniqueOrThrow({
     where : {
       id
     },
     include : {
       services : true
     }
   })
   return result
}



const updateCategoryByIdFromDB = async(id : string, updateData : IUpdateCategory) => {
    await prisma.category.findUniqueOrThrow({
        where : {
            id
        }
    })

    const result = await prisma.category.update({
        where : {
            id
        },
        data : updateData,
        include : {
            services : true
        }
    })
    return result;
}

const deleteCategoryByIdFromDB = async(id : string) => {
    await prisma.category.findUniqueOrThrow({
        where : {
            id
        } 
    })

    await prisma.category.delete({
        where : {
            id
        }
    })  

    return null;
} 


export const categoryService = {
    createCategoryIntoDB,
    getAllCategroyFromDB,
   getCategoryByIdfromDB,
   updateCategoryByIdFromDB,
   deleteCategoryByIdFromDB
}