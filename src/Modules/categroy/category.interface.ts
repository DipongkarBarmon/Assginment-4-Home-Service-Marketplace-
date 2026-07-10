import { CategoryWhereInput } from "../../../generated/prisma/models.js";

export interface categoryQuery extends CategoryWhereInput {
    searchTerm? : string,
    page ? : string,
    limit? : string,
    sortOrder? : string,
    sortBy? : string
}