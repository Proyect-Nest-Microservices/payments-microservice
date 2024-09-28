import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {

    private readonly stripe = new Stripe(envs.STRIPE_SECRET);


    async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
        
        const { currency, items, orderId } = paymentSessionDto;
        
        const lineItems = items.map(item => {
            return {
                price_data: {
                    currency,
                    product_data: {
                        name: item.name
                    },
                    unit_amount: Math.round(item.price * 100)
                },
                quantity: item.quantity
            }
        })
        const session = await this.stripe.checkout.sessions.create({
            //colocar aqui el ID de la orden
            payment_intent_data: {
                metadata: {
                    orderId:orderId
                }
            },
            line_items: lineItems,
            mode: 'payment',
            success_url:envs.STRIPE_SUCCESS_URL,
            cancel_url:envs.STRIPE_CANCEL_URL
        })
        return session;
    }

    async stripWebHook(req: Request, res: Response) {
        let event: Stripe.Event;
        const endPointSecret = envs.STRIPE_ENDPOINT_SECRET
        const sig = req.headers['stripe-signature']
        try {
            event = this.stripe.webhooks.constructEvent(
                req['rawBody'],
                sig,
                endPointSecret
            )
        } catch (error) {
            return res.status(400).json(`WebHook error ${error.message}`)
        }
        switch (event.type) {
            case 'charge.succeeded':
                const chargeSucceded = event.data.object;
                console.log({metadata: chargeSucceded.metadata})
            break;
            
            default:
                console.log(`Event ${event.type} not handled `)
            
        }
        return res.status(201).json({sig})
    }
}
