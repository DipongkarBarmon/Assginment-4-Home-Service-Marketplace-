import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums.js";
import { PaymentWhereInput } from "../../../generated/prisma/models.js";
import { prisma } from "../../lib/prisma.js";
import { IConfirmPayment, ICreatePayment, IGetPaymentQuery } from "./payment.interface.js";

const createPaymentIntoDB = async (userId: string, payload: ICreatePayment) => {
  const { bookingId, provider, paymentMethod, amount } = payload;

  const transactionResult = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUniqueOrThrow({
      where: { id: bookingId },
      include: { payments: true },
    });

    if (booking.customerId !== userId) {
      throw new Error("Forbidden! You can only pay for your own booking.");
    }

    if (booking.status !== BookingStatus.ACCEPTED) {
      throw new Error("Payment can only be created for accepted bookings.");
    }

    if (booking.payments?.status === PaymentStatus.SUCCESS) {
      throw new Error("Payment is already completed for this booking.");
    }

    const parsedAmount = amount ?? Number(booking.price);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      throw new Error("Invalid payment amount.");
    }

    if (booking.payments) {
      return tx.payment.update({
        where: { bookingId },
        data: {
          amount: parsedAmount,
          provider,
          paymentMethod,
          status: PaymentStatus.PENDING,
          transactionId: null,
          paidAt: null,
        },
        include: { booking: true },
      });
    }

    return tx.payment.create({
      data: {
        bookingId,
        amount: parsedAmount,
        provider,
        paymentMethod,
        status: PaymentStatus.PENDING,
      },
      include: { booking: true },
    });
  });

  return transactionResult;
};

const confirmPaymentIntoDB = async (userId: string, payload: IConfirmPayment) => {
  if (!payload.paymentId && !payload.bookingId) {
    throw new Error("paymentId or bookingId is required to confirm payment.");
  }

  const transactionResult = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findFirstOrThrow({
      where: payload.paymentId ? { id: payload.paymentId } : { bookingId: payload.bookingId },
      include: { booking: true },
    });

    if (payment.booking.customerId !== userId) {
      throw new Error("Forbidden! You can only confirm your own payment.");
    }

    const status = payload.status ?? PaymentStatus.SUCCESS;
    const transactionId =
      payload.transactionId ??
      (status === PaymentStatus.SUCCESS ? `txn_${Date.now()}_${Math.floor(Math.random() * 10000)}` : null);

    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status,
        transactionId,
        paidAt: status === PaymentStatus.SUCCESS ? new Date() : null,
      },
      include: { booking: true },
    });

    if (status === PaymentStatus.SUCCESS && payment.booking.status === BookingStatus.ACCEPTED) {
      await tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: BookingStatus.PAID },
      });
    }

    return updatedPayment;
  });

  return transactionResult;
};

const getUserPaymentHistoryFromDB = async (userId: string, query: IGetPaymentQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const andCondition: PaymentWhereInput[] = [];

  if (query.searchTerm) {
    andCondition.push({
      OR: [
        { paymentMethod: { contains: query.searchTerm, mode: "insensitive" } },
        { transactionId: { contains: query.searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (query.provider) {
    andCondition.push({ provider: query.provider });
  }

  if (query.status) {
    andCondition.push({ status: query.status });
  }

  if (query.bookingId) {
    andCondition.push({ bookingId: query.bookingId });
  }

  const whereCondition: PaymentWhereInput = andCondition.length > 0 ? { AND: andCondition } : {};

  const payments = await prisma.payment.findMany({
    where: {
      booking: {
        customerId: userId,
      },
      ...whereCondition,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      booking: true,
    },
  });

  return payments;
};

const getPaymentByIdFromDB = async (userId: string, paymentId: string) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: { booking: true },
  });

  if (payment.booking.customerId !== userId) {
    throw new Error("Forbidden! You can only view your own payment.");
  }

  return payment;
};

export const paymentService = {
  createPaymentIntoDB,
  confirmPaymentIntoDB,
  getUserPaymentHistoryFromDB,
  getPaymentByIdFromDB,
};
