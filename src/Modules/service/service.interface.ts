import { ServiceWhereInput } from "../../../generated/prisma/models.js";

export interface IServiceQuery extends ServiceWhereInput {
    searchTerm? : string,
    page ? : string,
    limit? : string,
    sortOrder? : string,
    sortBy? : string
}   