// app/api/pixel-event/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { eventName, params, eventId } = await req.json();

  const payload = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId, // ← MESMO ID do browser
      action_source: 'website',
      event_source_url: req.headers.get('referer') ?? '',
      user_data: {
        client_ip_address: req.headers.get('x-forwarded-for') ?? '',
        client_user_agent: req.headers.get('user-agent') ?? '',
      },
      custom_data: params ?? {},
    }],
  };

  await fetch(
    `https://graph.facebook.com/v19.0/${process.env.NEXT_PUBLIC_META_PIXEL_ID}/events?access_token=${process.env.NEXT_PUBLIC_META_CAPI_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  return NextResponse.json({ ok: true });
}