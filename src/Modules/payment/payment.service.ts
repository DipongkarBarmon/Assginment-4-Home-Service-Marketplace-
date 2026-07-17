import { BookingStatus, PaymentStatus, PaymentProvider, Role } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { TCreatePayment, IpaymentQuery } from "./payment.interface.js";
import Stripe from "stripe";
import config from '../../config/index.js';
import { stripe } from "../../lib/stripe.js";
 

 

const createCheckoutSession = async (customerId: string, payload: TCreatePayment) => {
  const booking = await prisma.booking.findFirstOrThrow({
    where: {
      id: payload.bookingId,
      customerId,
    },
    include: {
      service: true,
      customer: true,
    },
  });

 
  if (booking.status !== BookingStatus.ACCEPTED) {
    throw new Error('Booking is not accepted yet.');
  }

  const existingPayment = await prisma.payment.findUniqueOrThrow({ 
    where: {
       bookingId: booking.id 
      }
   });

  if (existingPayment && existingPayment.status === PaymentStatus.SUCCESS) {
     throw new Error('This booking has already been paid.');
  }

  // create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'bdt',
          // product_data: {
          //   name: booking.service?.name || booking.service?.title || 'Service Booking',
          //   description: `Booking for service ${booking.service?.name ?? booking.service?.title ?? ''}`,
          // },
          unit_amount: Math.round(Number(booking.price) * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${config.app_url}/payment/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payment/payment-cancelled`,
    metadata: {
      bookingId: booking.id,
    },
  });

 
  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      amount: booking.price as any,
      provider: PaymentProvider.STRIPE,
      paymentMethod: 'stripe',
      status: PaymentStatus.PENDING,
      customerId: booking.customerId,
      stripeCheckoutSessionId: session.id,
      currency: 'bdt',
    },
  });

  return { checkoutUrl: session.url, sessionId: session.id };
};

  
const handleStripeWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);

  console.log('Received Stripe event:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;

    const paymentRecord = await prisma.payment.findUnique({ where: { stripeCheckoutSessionId: sessionId } });
    if (!paymentRecord) {
      console.warn('Payment record not found for session', sessionId);
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: PaymentStatus.SUCCESS,
          paidAt: new Date(),
          transactionId: session.payment_intent as string | null,
          stripePaymentIntentId: session.payment_intent as string | null,
        },
      });

      await tx.booking.update({
        where: { id: paymentRecord.bookingId },
        data: { status: BookingStatus.PAID },
      });
    });
  }

  if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;
    const paymentRecord = await prisma.payment.findUnique({ where: { stripeCheckoutSessionId: sessionId } });
    if (!paymentRecord) return;
    await prisma.payment.update({ where: { id: paymentRecord.id }, data: { status: PaymentStatus.FAILED } });
  }
};

const getPaymentHistory = async (userId: string, role: string, query: IpaymentQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder ? query.sortOrder : 'desc';

  const where: any = {};
  if (query.id) where.id = query.id as any;
  if (query.status) where.status = query.status as any;
  if (query.bookingId) where.bookingId = query.bookingId as any;
  if (query.customerId) where.customerId = query.customerId as any;
  if (role === Role.CUSTOMER) where.customerId = userId;

  const payments = await prisma.payment.findMany({
    where,
    take: limit,
    skip,
    orderBy: { [sortBy]: sortOrder as any },
    select: {
      id: true,
      bookingId: true,
      amount: true,
      provider: true,
      paymentMethod: true,
      transactionId: true,
      status: true,
      paidAt: true,
      createdAt: true,
      currency: true,
      customerId: true,
    },
  });

  return {
    data: payments,
    meta: {
      page,
      limit,
      total: payments.length,
      totalPage: Math.ceil(payments.length / limit),
    },
  };
};

export const paymentService = {
  createCheckoutSession,
  handleStripeWebhook,
  getPaymentHistory,
};