import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const processedWebhookEvents = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers.get('x-razorpay-signature');

    const rawBody = await req.text();

    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json(
          { error: 'Missing x-razorpay-signature header' },
          { status: 400 }
        );
      }

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const isAuthentic = crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      );

      if (!isAuthentic) {
        console.warn('[Security Alert] Unauthorized webhook signature from Razorpay');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
      }
    }

    let event: any;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const eventId = event?.event_id || event?.id;
    if (eventId) {
      // Duplicate event protection
      if (processedWebhookEvents.has(eventId)) {
        return NextResponse.json({ received: true, note: 'Duplicate event ignored' });
      }
      processedWebhookEvents.add(eventId);
    }

    const eventType = event?.event;
    console.log(`[Razorpay Webhook] Received event: ${eventType} (ID: ${eventId})`);

    switch (eventType) {
      case 'payment.captured': {
        const payment = event?.payload?.payment?.entity;
        console.log(`[Payment Captured] ID: ${payment?.id}, Amount: ${payment?.amount / 100} INR`);
        // In full database setup: update orders and student_enrollments table
        break;
      }
      case 'order.paid': {
        const order = event?.payload?.order?.entity;
        console.log(`[Order Paid] ID: ${order?.id}, Receipt: ${order?.receipt}`);
        break;
      }
      case 'payment.failed': {
        const payment = event?.payload?.payment?.entity;
        console.warn(`[Payment Failed] ID: ${payment?.id}, Reason: ${payment?.error_description}`);
        break;
      }
      default:
        console.log(`[Razorpay Webhook] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing webhook.' },
      { status: 500 }
    );
  }
}
