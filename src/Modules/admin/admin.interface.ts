import { UserWhereInput } from "../../../generated/prisma/models.js";

export interface IUserQuery extends UserWhereInput {
    searchTerm? : string,
    page ? : string,
    limit? : string,
    sortOrder? : string,
    sortBy? : string
}


export interface ICreateCategory {
    name : string,
    icon? : string,
    description? : string,
}


export interface IUpdateCategory { 
    name? : string,
    icon? : string,
    description? : string,
}