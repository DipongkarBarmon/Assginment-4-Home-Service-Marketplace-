import { UserWhereInput } from "../../../generated/prisma/models.js";

export interface IUserQuery extends UserWhereInput {
    searchTerm? : string,
    page ? : string,
    limit? : string,
    sortOrder? : string,
    sortBy? : string
}