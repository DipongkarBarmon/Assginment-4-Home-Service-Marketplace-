import { PaymentStatus } from "../../../generated/prisma/enums.js";
import { PaymentWhereInput } from "../../../generated/prisma/models.js";

export interface ICreatePayment {
  bookingId: string;
  provider: "STRIPE" | "SSLCOMMERZ";
  paymentMethod: string;
  amount?: number;
}

export interface IConfirmPayment {
  paymentId?: string;
  bookingId?: string;
  transactionId?: string;
  status?: PaymentStatus;
}

export interface IGetPaymentQuery extends PaymentWhereInput {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortOrder?: string;
  sortBy?: string;
}
