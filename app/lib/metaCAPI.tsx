export async function sendMetaEvent({
  eventName,
  eventTime,
  userData,
  eventSourceUrl,
}: {
  eventName: string;
  eventTime: number;
  userData: {
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string; // fbclid cookie
    fbp?: string; // _fbp cookie
  };
  eventSourceUrl: string;
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.NEXT_PUBLIC_META_CONVERSION_API_KEY;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime,
        event_source_url: eventSourceUrl,
        action_source: "website",
        user_data: userData,
      },
    ],
  };

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  return res.json();
}
