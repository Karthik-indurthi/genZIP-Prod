import * as admin from "firebase-admin";
import Stripe from "stripe";
import express from "express";
import cors from "cors";
import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https"; 
import * as dotenv from "dotenv";

setGlobalOptions({ region: "asia-south1" });

admin.initializeApp();

// Initialize Stripe
dotenv.config(); // Load variables from .env

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  typescript: true,
});

// Setup Express App
const app = express();

// Allow CORS for all origins (dev + prod)
app.use(cors({ origin: "http://localhost:5173/" }));

// ✅ Create Checkout Session (One-Time Payment)
app.post("/createCheckoutSession", async (req, res) => {
  try {
    const { interviewId, amount, hrEmail } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: {
            name: `Interview Payment - ${interviewId}`,
          },
          unit_amount: amount * 100, // Stripe expects amount in paisa (cents)
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `http://localhost:5173/payment-success?interviewId=${interviewId}`,
      cancel_url: `http://localhost:5173/payment-cancel`,
      metadata: {
        interviewId,
        hrEmail,
      }
    });

    res.status(200).send({ id: session.id });
  } catch (error) {
    console.error("Stripe session creation failed", error);
    res.status(500).send({ error: "Unable to create Stripe session" });
  }
});

// ✅ Create Subscription Session (Subscription Plan)
app.post("/createSubscriptionSession", async (req, res) => {
  try {
    const { planType, hrEmail } = req.body;

    const priceIdMap: Record<string, string> = {
      "Basic": "price_xxxxxxxx",    // Replace with real Stripe Price ID
      "Pro": "price_yyyyyyyyy",      // Replace with real Stripe Price ID
      "Premium": "price_zzzzzzzzz"   // Replace with real Stripe Price ID
    };

    const selectedPriceId = priceIdMap[planType];

    if (!selectedPriceId) {
      res.status(400).send({ error: "Invalid subscription plan selected" });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price: selectedPriceId,
        quantity: 1,
      }],
      mode: "subscription",
      success_url: `http://localhost:5173/subscription-success`,
      cancel_url: `http://localhost:5173/payment-cancel`,
      customer_email: hrEmail,
      metadata: {
        planType,
        hrEmail,
      }
    });

    res.status(200).send({ id: session.id });
  } catch (error) {
    console.error("Stripe Subscription Session Error:", error);
    res.status(500).send({ error: "Unable to create subscription session" });
  }
});

// Export express app as a single HTTP function
export const paymentsApi  = onRequest(app);
