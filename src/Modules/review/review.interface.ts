import { ReviewWhereInput } from "../../../generated/prisma/models.js";

 

export interface TCreateReview {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface IGetReviews extends ReviewWhereInput {
    page ? : string,
    limit? : string,
    sortOrder? : string,
    sortBy? : string
    searchTerm?: string;
}

export interface IServiceReview extends ReviewWhereInput {
   page ? : string,
    limit? : string,
    sortOrder? : string,
    sortBy? : string
}

export interface TUpdateReview {
  rating?: number;
  comment?: string;
}