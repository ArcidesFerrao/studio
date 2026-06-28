// app/api/pixel-event/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createHash } from "crypto";

function sha256(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function POST(req: NextRequest) {
  const { eventName, params, eventId, userData } = await req.json();

  const user_data: Record<string, string> = {
    client_ip_address:
      req.headers.get("x-forwarded-for")?.split(",")[0] ?? "",
    client_user_agent: req.headers.get("user-agent") ?? "",
  };

  if (userData?.email) user_data.em = sha256(userData.email);
  if (userData?.phone) user_data.ph = sha256(userData.phone.replace(/\D/g, ""));

  const payload = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId, // ← MESMO ID do browser
      action_source: 'website',
      event_source_url: req.headers.get('referer') ?? '',
      user_data,
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