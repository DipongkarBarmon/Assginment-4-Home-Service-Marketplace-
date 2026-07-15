import { BookingStatus } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { ICreateReview } from "./review.interface.js";

const createReviewIntoDB = async (userId: string, payload: ICreateReview) => {
  const { bookingId, rating, comment } = payload;

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const transactionResult = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUniqueOrThrow({
      where: { id: bookingId },
      include: { reviews: true },
    });

    if (booking.customerId !== userId) {
      throw new Error("Forbidden! You can only review your own booking.");
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new Error("Review can only be added after booking completion.");
    }

    if (booking.reviews) {
      throw new Error("Review already exists for this booking.");
    }

    const review = await tx.review.create({
      data: {
        customerId: userId,
        technicianId: booking.technicianId,
        bookingId,
        rating,
        comment,
      },
      include: {
        customer: {
          omit: {
            password: true,
          },
        },
      },
    });

    const ratingAggregation = await tx.review.aggregate({
      where: {
        technicianId: booking.technicianId,
      },
      _avg: {
        rating: true,
      },
    });

    const averageRating = Number((ratingAggregation._avg.rating ?? 0).toFixed(1));

    await tx.technicianProfile.update({
      where: {
        id: booking.technicianId,
      },
      data: {
        averageRating,
      },
    });

    return review;
  });

  return transactionResult;
};

export const reviewService = {
  createReviewIntoDB,
};
