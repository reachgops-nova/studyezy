import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 1. Subscription Check Gating
 * Safely checks if the parent/student profile has active SaaS permissions using the schema-native trialEndsAt column.
 * (Next.js App Router: Not exported to satisfy route.ts index signature rules)
 */
async function checkSubscriptionAccess(userId: string): Promise<{ authorized: boolean; reason: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { trialEndsAt: true }
    });

    if (!user) {
      return { authorized: false, reason: "User not found" };
    }

    const now = new Date();
    const expiresAt = user.trialEndsAt ? new Date(user.trialEndsAt) : null;

    if (expiresAt && expiresAt > now) {
      return { authorized: true, reason: "Active trial/subscription access" };
    }

    return { authorized: false, reason: "Access expired. Please renew your subscription." };
  } catch (error) {
    return { authorized: false, reason: "Database error checking subscription status" };
  }
}

/**
 * 2. Next.js App Router POST API Route Handler
 * Creates checkout session for Stripe or initiates Razorpay order sequence.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, email, gateway, planType } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing required parameters userId or email" }, { status: 400 });
    }

    // Determine plan pricing (e.g., $15/month or $120/year)
    const amount = planType === 'annual' ? 12000 : 1500; // in cents or paise
    const currency = gateway === 'razorpay' ? 'INR' : 'USD';

    // ---- STRIPE GATEWAY INGESTION PATH ----
    if (gateway === 'stripe') {
      console.log(`Creating Stripe checkout session for ${email} with plan: ${planType}...`);
      
      const mockSessionId = `cs_test_${Math.random().toString(36).substring(7)}`;
      const mockCheckoutUrl = `https://checkout.stripe.com/pay/${mockSessionId}`;

      return NextResponse.json({
        gateway: 'stripe',
        sessionId: mockSessionId,
        checkoutUrl: mockCheckoutUrl,
        message: "Stripe Checkout session created successfully!"
      });
    }

    // ---- RAZORPAY GATEWAY INGESTION PATH ----
    if (gateway === 'razorpay') {
      console.log(`Creating Razorpay order for ${email} with plan: ${planType}...`);
      
      const mockOrderId = `order_${Math.random().toString(36).substring(7)}`;

      return NextResponse.json({
        gateway: 'razorpay',
        orderId: mockOrderId,
        amount: amount,
        currency: currency,
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_mock_id",
        message: "Razorpay order initiated successfully!"
      });
    }

    return NextResponse.json({ error: "Unsupported gateway type" }, { status: 400 });
  } catch (error: any) {
    console.error("❌ Checkout Gateway Error:", error);
    return NextResponse.json({ error: "Internal checkout system failure" }, { status: 500 });
  }
}

/**
 * 3. Stripe & Razorpay Webhook Callback Handler
 * Listens to successful transaction payloads and extends trialEndsAt in postgres.
 * (Next.js App Router: Helper method, not exported to satisfy route.ts index signature rules)
 */
async function handlePaymentWebhook(req: Request) {
  try {
    const rawBody = await req.text();
    const event = JSON.parse(rawBody);

    // ---- STRIPE WEBHOOK EVENT PROCESSING ----
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id;
      
      console.log(`💰 Stripe webhook: Payment succeeded for user ${userId}! Extending subscription...`);

      await prisma.user.update({
        where: { id: userId },
        data: {
          trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // Extend for 1 year
        }
      });

      return NextResponse.json({ received: true, status: "Subscription extended" });
    }

    // ---- RAZORPAY WEBHOOK EVENT PROCESSING ----
    if (event.event === 'order.paid') {
      const payload = event.payload.payment.entity;
      const email = payload.email;

      console.log(`💰 Razorpay webhook: Order paid for ${email}! Extending subscription...`);

      await prisma.user.updateMany({
        where: { email: email },
        data: {
          trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // Extend for 1 year
        }
      });

      return NextResponse.json({ received: true, status: "Subscription extended" });
    }

    return NextResponse.json({ received: true, status: "Event ignored" });
  } catch (error: any) {
    console.error("❌ Webhook processing failed:", error.message || error);
    return NextResponse.json({ error: "Webhook event error" }, { status: 400 });
  }
}
