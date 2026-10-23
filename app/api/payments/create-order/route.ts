import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, itemType, title, amountInr, userId, userEmail } = body;

    if (!amountInr || amountInr <= 0) {
      return NextResponse.json({ error: 'Valid amountInr is required.' }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const amountInPaise = Math.round(Number(amountInr) * 100);
    const receipt = `rcpt_${Date.now()}_${(userId || 'guest').slice(0, 6)}`;

    // Check if real Razorpay credentials are provided
    const isLiveConfigured = Boolean(keyId && keySecret && !keyId.includes('placeholder'));

    if (isLiveConfigured) {
      // Call official Razorpay Orders API
      const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authHeader}`,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt,
          notes: {
            itemId: itemId || 'custom',
            itemType: itemType || 'study_material',
            title: title || 'SarkariExamHub Course',
            userId: userId || 'anonymous',
            userEmail: userEmail || '',
          },
        }),
      });

      if (!rzpRes.ok) {
        const errorData = await rzpRes.json();
        console.error('Razorpay Order API Error:', errorData);
        return NextResponse.json(
          { error: 'Failed to create Razorpay order.', details: errorData },
          { status: 502 }
        );
      }

      const orderData = await rzpRes.json();
      return NextResponse.json({
        success: true,
        orderId: orderData.id,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId,
        environment: keyId?.startsWith('rzp_live') ? 'live' : 'test',
        mode: 'razorpay_gateway',
      });
    }

    // Secure Test Sandbox Fallback:
    // Keeps application safe and functional in test mode until real credentials are provided
    const mockOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: keyId || 'rzp_test_sarkari_sandbox',
      environment: 'test_sandbox',
      mode: 'test_sandbox',
      notice:
        'Running in safe Test Mode. Add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment to connect real Razorpay payments.',
    });
  } catch (error: any) {
    console.error('Payment create-order error:', error);
    return NextResponse.json(
      { error: 'Internal server error while creating payment order.' },
      { status: 500 }
    );
  }
}
