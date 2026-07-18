import { PaymentScalarWhereWithAggregatesInput } from "../../../generated/prisma/models.js";


export interface TCreatePayment {
  bookingId: string;
}
 

export interface IpaymentQuery extends PaymentScalarWhereWithAggregatesInput {
  page?: string;
  limit?: string;
  sortBy?: string;
  searchTerm?: string;
  sortOrder?: 'asc' | 'desc';
}