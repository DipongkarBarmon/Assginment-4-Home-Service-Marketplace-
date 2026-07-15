 
import { BookingWhereInput } from "../../../generated/prisma/models.js";

export interface IGETBooking extends BookingWhereInput {
    searchTerm? : string,
    page ? : string,
    limit? : string,
    sortOrder? : string,
    sortBy? : string
}