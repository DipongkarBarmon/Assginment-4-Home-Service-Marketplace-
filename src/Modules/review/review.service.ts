 
import { BookingStatus } from "../../../generated/prisma/enums.js";
import { ReviewWhereInput } from "../../../generated/prisma/models.js";
import { prisma } from "../../lib/prisma.js";
import { IGetReviews, IServiceReview, TCreateReview, TUpdateReview } from "./review.interface.js";
 


const createReview = async (userId:string ,payload : TCreateReview) =>{

    const {rating ,bookingId,comment}=payload;

    const booking = await prisma.booking.findUniqueOrThrow ({
        where :{
            id :bookingId,
            customerId: userId,
        },
        include :{
            reviews : true, 
        }
    });
 

    if(booking.status !== BookingStatus.COMPLETED) {
        throw new Error("You can only review completed booking");
    }

    if(booking.reviews){
        throw new Error("review already exists");
    }

    const result = await prisma.$transaction(async (tx) =>{
        
        const review = await tx.review.create({
         data:{
            bookingId,
            customerId : userId,
            technicianId: booking.technicianId,
            serviceId: booking.serviceId,
            rating,
            comment,
           },
        });

        const technicianStats = await tx.review.aggregate({
            where :{
                technicianId : booking.technicianId,
            },
            _avg :{
                rating :true,
            },
            _count :{
                rating :true,
            }
        });

        await tx.technicianProfile.update({
            where: {
                id: booking.technicianId,
            },
            data: {
                averageRating: technicianStats._avg.rating ?? 0,

            },
        });

        const serviceStats = await tx.review.aggregate({
            where: {
                serviceId: booking.serviceId,
            },
            _avg: {
                rating: true,
            },
        });

        await tx.service.update({
            where: {
                id: booking.serviceId,
            },
            data: {
                averageRating: serviceStats._avg.rating ?? 0,
            },
        });

    return review;

    });

    return result ;

} 

const getReviews = async(userId : string,query : IGetReviews) =>{
      
     const limit = query.limit?Number(query.limit) : 10;
     const page = query.page?Number(query.page): 1;
     const skip = (page -1)*limit;
     const sortBy = query.sortBy? query.sortBy : "createdAt";
     const sortOrder = query.sortOrder? query.sortOrder : "desc";

     const andCondition : ReviewWhereInput[] = []
     
     if(query.serviceId) {
        andCondition.push({
            serviceId : query.serviceId
        })
     }

     if(query.technicianId) {
        andCondition.push({
            technicianId : query.technicianId
        })
     }

     if(query.customerId) {
        andCondition.push({
            customerId : query.customerId
        })
     }

     if(query.bookingId) {
        andCondition.push({
            bookingId : query.bookingId
        })
     }
    const reviews = await prisma.review.findMany({
        where :{
            AND : andCondition,
        },
 
        skip,
        take: limit,

        orderBy: {
        [sortBy]: sortOrder,
        },
        include: {
            technician: {
                include : {
                    user : {
                        omit : {
                            password : true
                        }
                    }
                }
            },
            customer: {
                omit : {
                  password : true
                }
            },
            service : true
        },  
    });

  
  return reviews 

    
}

const getServiceReviews = async (serviceId: string,query :IServiceReview) => {
  
    await prisma.service.findUniqueOrThrow({
        where: {
        id: serviceId,
        },
    });

     const limit = query.limit?Number(query.limit) : 10;
     const page = query.page?Number(query.page): 1;
     const skip = (page -1)*limit;
     const sortBy = query.sortBy? query.sortBy : "createdAt";
     const sortOrder = query.sortOrder? query.sortOrder : "desc";


  const reviews = await prisma.review.findMany({
    where: {
      serviceId,
    },
    skip,
    take: limit,
     orderBy : {
            [sortBy] : sortOrder
        },
    include: {  
        technician: {
            include : {
                user : {
                    omit : {
                        password : true
                    }
                }
            }
        },
        customer: {
            omit : {
              password : true
            }
        }
    },
  });
 
  return reviews

};

const getTechnicianReviews = async (technicianId: string,query :IServiceReview) => {
  
    await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            id: technicianId,
        },
    });

     const limit = query.limit?Number(query.limit) : 10;
     const page = query.page?Number(query.page): 1;
     const skip = (page -1)*limit;
     const sortBy = query.sortBy? query.sortBy : "createdAt";
     const sortOrder = query.sortOrder? query.sortOrder : "desc";

   

  const reviews = await prisma.review.findMany({
    where: {
      technicianId,
    },
    skip,
    take: limit,
     orderBy : {
            [sortBy] : sortOrder
        },
    include: {
        customer : {
            omit : {
                password : true
            }
        },
        service : true  
    },
    
  });

  return reviews

};


const updateReview = async (
  customerId: string,
  reviewId: string,
  payload: TUpdateReview
) => {
  const review = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
      customerId,
    },
  });

 

  return prisma.$transaction(async (tx) => {
    const updatedReview = await tx.review.update({
      where: {
        id: review.id,
      },
      data: payload,
    });

    const technicianStats = await tx.review.aggregate({
      where: {
        technicianId: review.technicianId,
      },
      _avg: {
        rating: true,
      },
    });

    await tx.technicianProfile.update({
      where: {
        id: review.technicianId,
      },
      data: {
        averageRating: technicianStats._avg.rating ?? 0,
      },
    });

    const serviceStats = await tx.review.aggregate({
      where: {
        serviceId: review.serviceId,
      },
      _avg: {
        rating: true,
      },
     
    });

    await tx.service.update({
      where: {
        id: review.serviceId,
      },
      data: {
        averageRating: serviceStats._avg.rating ?? 0,
      },
    });

    return updatedReview;
  });
};


const deleteReview = async (
  customerId: string,
  reviewId: string
) => {
  const review = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
      customerId,
    },
  });

 

  return prisma.$transaction(async (tx) => {
    await tx.review.delete({
      where: {
        id: review.id,
      },
    });

    const technicianStats = await tx.review.aggregate({
      where: {
        technicianId: review.technicianId,
      },
      _avg: {
        rating: true,
      },
    });

    await tx.technicianProfile.update({
      where: {
        id: review.technicianId,
      },
      data: {
        averageRating: technicianStats._avg.rating ?? 0,
     
      },
    });

    const serviceStats = await tx.review.aggregate({
      where: {
        serviceId: review.serviceId,
      },
      _avg: {
        rating: true,
      },
    });

    await tx.service.update({
      where: {
        id: review.serviceId,
        
      },
      data: {
        averageRating: serviceStats._avg.rating ?? 0,
      },
    });
    return null;
  });
};



export const ReviewService = {
  createReview,
  getReviews,
  getServiceReviews,
  getTechnicianReviews,
  updateReview,
  deleteReview,
};