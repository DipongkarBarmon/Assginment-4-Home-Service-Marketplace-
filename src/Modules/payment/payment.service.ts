import { BookingStatus, PaymentStatus, PaymentProvider, Role } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { TCreatePayment, IpaymentQuery } from "./payment.interface.js";
import Stripe from "stripe";
import config from '../../config/index.js';
import { stripe } from "../../lib/stripe.js";
import { paymentUtility } from "./payment.uitility.js";
import { PaymentWhereInput } from "../../../generated/prisma/models.js";
 

 

const createCheckoutSession = async (customerId: string, payload: TCreatePayment) => {
  const transactionResult = await prisma.$transaction(async (prisma) => {
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

  const existingPayment = await prisma.payment.findUnique({ 
    where: {
       bookingId: booking.id 
      }
   });

  if (existingPayment && existingPayment.status === PaymentStatus.SUCCESS) {
     throw new Error('This booking has already been paid.');
  }

   let stripeCustomerId = booking.customer.stripeCustomerId;

  if (!stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      name: booking.customer.name,
      email: booking.customer.email,
    });

    stripeCustomerId = stripeCustomer.id;

    await prisma.user.update({
      where: {
        id: booking.customer.id,
      },
      data: {
        stripeCustomerId,
      },
    });
  }

  // create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'bdt',
          product_data: {
            name: booking.service?.title || 'Service Booking',
            description: booking.service.description ?? ""
          },
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
   
  if (!existingPayment) {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        customerId: booking.customerId,
        amount: booking.price ,
        provider: PaymentProvider.STRIPE,
        paymentMethod: 'stripe',
        status: PaymentStatus.PENDING,
        paidAt: null,
        currency: 'bdt',
        stripeCustomerId: stripeCustomerId,
        stripeCheckoutSessionId: session.id,
      },
    });
  } else {
    await prisma.payment.update({
      where: {
        bookingId: booking.id,
      },

      data: {
        stripeCustomerId: stripeCustomerId,
        stripeCheckoutSessionId: session.id,
        status: PaymentStatus.PENDING,
      },
    });
  }
   return session.url;
  })

  return transactionResult; 

};


  
const handleStripeWebhook = async (payload: Buffer, signature: string) => {
  //  console.log('Number of events:');
  const endpointSecret =  config.stripe_webhook_secret;
  // console.log('Received Stripe webhook event with payload length:', payload);
  // console.log('Received Stripe webhook event with signature:', signature);
  // console.log('Using Stripe webhook endpoint secret:', endpointSecret);
  const event = stripe.webhooks.constructEvent(
     payload,
     signature, 
     endpointSecret
    );
    console.log("Hello from stripe webhook handler");

  console.log('Received Stripe event:', event.type);

     switch (event.type) {
        case 'checkout.session.completed':
          await paymentUtility.handleCheckoutCompleted(event.data.object)
          break;
        case 'checkout.session.expired':
          await paymentUtility.handleSessionExpired(event.data.object as Stripe.Checkout.Session)
          break;
        case 'checkout.session.async_payment_failed' :
          await paymentUtility.handleSessionExpired(event.data.object as Stripe.Checkout.Session)
          break;
        case "payment_intent.payment_failed":
          await paymentUtility.handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
          break;

        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}.`);
          break;
      }
};


const getPaymentHistory = async (userId: string, role: string, query: IpaymentQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder ? query.sortOrder : 'desc';
  
   const andCondition : PaymentWhereInput[] = []

         if(query.status){
              andCondition.push({
                  status:query.status
              })
          }
           
           if(query.id){
              andCondition.push({
                  id:query.id
              })
          }
  
       
         
        if(query.bookingId){
            andCondition.push({
                bookingId:query.bookingId 
            })
        }

        if(query.paymentMethod){
            andCondition.push({
                paymentMethod:query.paymentMethod
            })
        }
        if(query.provider){
            andCondition.push({
                provider:query.provider
            })
        }
        if(query.customerId){
            andCondition.push({
                customerId:query.customerId
            })
        }

      
const paymentHistory = await prisma.payment.findMany({
    where: {
      AND: andCondition
    },
    take: limit,
    skip,
    orderBy: { 
      [sortBy]: sortOrder
     },

     include: {
      booking: {
        include: {
          service: true,
          customer: {
            omit: {
              password: true
            }, 
          },
        },
      },
    },  
     
  });

   return paymentHistory;
};

export const paymentService = {
  createCheckoutSession,
  handleStripeWebhook,
  getPaymentHistory,
};