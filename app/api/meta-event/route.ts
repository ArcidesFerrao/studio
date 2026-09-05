import { NextRequest, NextResponse } from 'next/server';
import { sendMetaEvent } from '@/app/lib/metaCAPI';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { eventName, eventSourceUrl } = body;

  const ip = req.headers.get('x-forwarded-for') ?? '';
  const userAgent = req.headers.get('user-agent') ?? '';

  // Read Meta cookies from the request
  const cookieHeader = req.headers.get('cookie') ?? '';
  const fbc = cookieHeader.match(/_fbc=([^;]+)/)?.[1];
  const fbp = cookieHeader.match(/_fbp=([^;]+)/)?.[1];

  const result = await sendMetaEvent({
    eventName,
    eventTime: Math.floor(Date.now() / 1000),
    userData: {
      client_ip_address: ip,
      client_user_agent: userAgent,
      ...(fbc && { fbc }),
      ...(fbp && { fbp }),
    },
    eventSourceUrl,
  });

  return NextResponse.json(result);
}