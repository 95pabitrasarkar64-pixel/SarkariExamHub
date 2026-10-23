import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { materialId, userId, userEmail, userName } = body;

    if (!materialId) {
      return NextResponse.json({ error: 'materialId is required' }, { status: 400 });
    }

    // Free sample material IDs that any aspirant can view
    const freeMaterialIds = [1, 4, 6, 8];
    const isFree = freeMaterialIds.includes(Number(materialId));

    // If paid and no authenticated user
    if (!isFree && !userId) {
      return NextResponse.json(
        {
          error: 'Authentication and verified entitlement required to access this paid study material.',
          code: 'UNAUTHORIZED_ACCESS',
          isPaid: true,
        },
        { status: 401 }
      );
    }

    // Generate personalized anti-piracy watermark token
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const timestamp = Date.now();
    const expiresAt = timestamp + 15 * 60 * 1000; // 15 minutes short-lived access

    const watermarkPayload = {
      studentName: userName || userEmail?.split('@')[0] || 'Registered Aspirant',
      studentId: userId || 'GUEST-ASPIRANT',
      materialId,
      issuedAt: new Date(timestamp).toISOString(),
      expiresAt: new Date(expiresAt).toISOString(),
      ipHash: crypto.createHash('md5').update(clientIp).digest('hex').slice(0, 8),
    };

    const watermarkText = `SARKARIEXAMHUB • LICENSED TO: ${watermarkPayload.studentName.toUpperCase()} (ID: ${watermarkPayload.studentId}) • NOT FOR RESALE • ${watermarkPayload.issuedAt.slice(0, 10)}`;

    return NextResponse.json({
      success: true,
      entitled: true,
      isFree,
      materialId,
      watermarkText,
      watermarkDetails: watermarkPayload,
      accessExpiresAt: expiresAt,
      allowedViewer: 'in_browser_restricted',
    });
  } catch (error: any) {
    console.error('Material entitlement access check error:', error);
    return NextResponse.json(
      { error: 'Internal server error checking material entitlement.' },
      { status: 500 }
    );
  }
}
