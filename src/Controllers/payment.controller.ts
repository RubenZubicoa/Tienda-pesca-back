import { Request, Response, NextFunction } from "express";
import stripe from "../libs/stripe";

export async function createPaymentController(req: Request, res: Response, next: NextFunction) {
    try {
        const { amount, currency } = req.body;
        if (!amount || !currency) {
            return res.status(400).json({ message: "El campo 'amount' y 'currency' son obligatorios" });
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });
        res.status(200).json(paymentIntent);
    } catch (error) {
        next(error);
    }
}