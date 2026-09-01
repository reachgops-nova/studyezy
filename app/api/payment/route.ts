import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// In a real project, we load keys from process.env
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock';

/**
 * 1. Subscription Check Gating Middleware
 * Checks if parent/student profile has active SaaS permissions.
 */
export async function checkSubscriptionAccess(userId: string): Promise<{ authorized: boolean; reason: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true, subscriptionExpiresAt: true }
    });

    if (!user) {
      return { authorized: false, reason: "User not found" };
    }

    const now = new Date();
    const expiresAt = user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt) : null;

    if (user.subscriptionStatus === 'active') {
      return { authorized: true, reason: "Active subscription" };
    }

    if (user.subscriptionStatus === 'trial' && expiresAt && expiresAt > now) {
      return { authorized: true, reason: "Active free trial" };
    }

    return { authorized: false, reason: "Subscription has expired" };
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
      
      // Mock Stripe session creation (replace with actual stripe npm client)
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
      
      // Mock Razorpay order creation (replace with actual razorpay client)
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
 * Listens to successful transaction payloads and extends subscription status in postgres
 */
export async function handlePaymentWebhook(req: Request) {
  try {
    const rawBody = await req.text();
    const headers = req.headers;
    
    // In production, we verify webhook signatures:
    // const sig = headers.get('stripe-signature');
    // const event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);

    const event = JSON.parse(rawBody);

    // ---- STRIPE WEBHOOK EVENT PROCESSING ----
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id; // we passed userId here during checkout creation
      
      console.log(`💰 Stripe webhook: Payment succeeded for user ${userId}! Extending subscription...`);

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: 'active',
          subscriptionExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // Extend for 1 year
        }
      });

      return NextResponse.json({ received: true, status: "Subscription updated to ACTIVE" });
    }

    // ---- RAZORPAY WEBHOOK EVENT PROCESSING ----
    if (event.event === 'order.paid') {
      const payload = event.payload.payment.entity;
      const email = payload.email; // search user by email

      console.log(`💰 Razorpay webhook: Order paid for ${email}! Extending subscription...`);

      await prisma.user.updateMany({
        where: { email: email },
        data: {
          subscriptionStatus: 'active',
          subscriptionExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // Extend for 1 year
        }
      });

      return NextResponse.json({ received: true, status: "Subscription updated to ACTIVE" });
    }

    return NextResponse.json({ received: true, status: "Event ignored" });
  } catch (error: any) {
    console.error("❌ Webhook processing failed:", error.message || error);
    return NextResponse.json({ error: "Webhook event error" }, { status: 400 });
  }
}
