import Stripe from "stripe"
import { stripe } from "../../lib/stripe.js"
import { prisma } from "../../lib/prisma.js"
import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums.js";

 


const handleCheckoutCompleted = async(session : Stripe.Checkout.Session) => {
      console.log('Handling checkout.session.completed event for session:', session.id);
      const payment = await prisma.payment.findUniqueOrThrow({
        where: {
          stripeCheckoutSessionId: session.id,
        },
      });
      
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent as string
      );

      const charge =
        paymentIntent.latest_charge?.toString() ?? null;

      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            status: PaymentStatus.SUCCESS,

            stripePaymentIntentId: paymentIntent.id,

            stripeChargeId: charge,

            paymentMethod:
              paymentIntent.payment_method_types[0],

            paidAt: new Date(),
          },
        });

        await tx.booking.update({
          where: {
            id: payment.bookingId,
          },
          data: {
            status: BookingStatus.PAID,
          },
        });
      });
}


const handleSessionExpired = async (payload: Stripe.Checkout.Session  ) => {

  const transaction = await prisma.$transaction(async (prisma) => {
    
    const sessionId = payload.id;
    const paymentRecord = await prisma.payment.findUniqueOrThrow({ 
      where: { 
        stripeCheckoutSessionId: sessionId 
      }
     });

    if (!paymentRecord){
      console.error(`Payment record not found for checkout session ID: ${sessionId}`);
       return;
    }

    await prisma.payment.update({
      where: {
        id: paymentRecord.id
      },
      data: {
        status: PaymentStatus.FAILED
      }
    });
  })
}

const handlePaymentFailed = async (paymentIntent: Stripe.PaymentIntent) => {
  const transaction = await prisma.$transaction(async (prisma) => {
    
    const paymentRecord = await prisma.payment.findUniqueOrThrow({
      where: {
        stripePaymentIntentId: paymentIntent.id
      }
    });

    if (!paymentRecord){    
      console.error(`Payment record not found for payment intent ID: ${paymentIntent.id}`);
       return;
    }
    
    await prisma.payment.update({
      where: {
        id: paymentRecord.id
      },
      data: {
        status: PaymentStatus.FAILED
      }
    });
  })
} 


export const paymentUtility = {
    handleCheckoutCompleted,
    handleSessionExpired,
    handlePaymentFailed
}