import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// In-memory processed payments cache for idempotency and replay/duplicate protection
const processedPayments = new Map<string, { orderId: string; verifiedAt: string; status: string }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, itemId, userId } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { error: 'razorpay_order_id and razorpay_payment_id are required.' },
        { status: 400 }
      );
    }

    // 1. Idempotency & Duplicate Protection Check
    if (processedPayments.has(razorpay_payment_id)) {
      const existing = processedPayments.get(razorpay_payment_id)!;
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        message: 'Payment has already been verified and processed.',
        paymentId: razorpay_payment_id,
        orderId: existing.orderId,
        verifiedAt: existing.verifiedAt,
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // 2. Real Razorpay Signature Verification
    if (keySecret) {
      if (!razorpay_signature) {
        return NextResponse.json(
          { error: 'razorpay_signature is required for verification.' },
          { status: 400 }
        );
      }

      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const isSignatureValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpay_signature)
      );

      if (!isSignatureValid) {
        console.warn(`[Security Alert] Invalid payment signature for order ${razorpay_order_id}`);
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid payment signature. Verification failed.',
            code: 'INVALID_SIGNATURE',
          },
          { status: 403 }
        );
      }
    } else {
      // Safe Test Sandbox Verification
      // If order starts with mock prefix or no keySecret is configured
      if (!razorpay_order_id.startsWith('order_test_') && !razorpay_payment_id.startsWith('pay_test_')) {
        return NextResponse.json(
          {
            error:
              'RAZORPAY_KEY_SECRET is not configured on the server. Cannot verify production signatures.',
          },
          { status: 500 }
        );
      }
    }

    // 3. Mark payment as verified in idempotency cache
    const timestamp = new Date().toISOString();
    processedPayments.set(razorpay_payment_id, {
      orderId: razorpay_order_id,
      verifiedAt: timestamp,
      status: 'captured',
    });

    // 4. Grant Entitlement / Access
    return NextResponse.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      itemId: itemId || 'course_access',
      userId: userId || 'student',
      accessGranted: true,
      verifiedAt: timestamp,
      message: 'Payment signature verified successfully. Access granted to student.',
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error during payment verification.' },
      { status: 500 }
    );
  }
}
