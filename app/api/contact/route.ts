import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
    const { name, phone, email, service, message } = await req.json();

    const { error } = await resend.emails.send({
        // from: "JGTS Imobiliária <noreply@jgtsimobiliaria.com>",
        from: "WebStudio <noreply@evolurelabs.com>",
        to: "cidesferrao@gmail.com",
        subject: `Nova mensagem de ${name} — ${service || "Contacto geral"}`,
    html: `
  <body style="margin:0;padding:0;background-color:#14111a;font-family:'DM Sans',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#14111a;padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#1c1822;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:32px;">
                <h2 style="margin:0 0 24px;color:#1D9E75;font-family:'Syne',Arial,sans-serif;font-size:22px;">
                  Nova mensagem do site
                </h2>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td style="padding:6px 0;color:#a0a0a0;font-size:14px;width:110px;">Nome</td>
                    <td style="padding:6px 0;color:#ffffff;font-size:14px;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#a0a0a0;font-size:14px;">Telefone</td>
                    <td style="padding:6px 0;color:#ffffff;font-size:14px;">${phone}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#a0a0a0;font-size:14px;">Email</td>
                    <td style="padding:6px 0;color:#ffffff;font-size:14px;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#a0a0a0;font-size:14px;">Serviço</td>
                    <td style="padding:6px 0;color:#ffffff;font-size:14px;">${service}</td>
                  </tr>
                </table>

                <hr style="border:none;border-top:1px solid #2a2630;margin:0 0 20px;" />

                <p style="margin:0 0 8px;color:#1D9E75;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">
                  Mensagem
                </p>
                <p style="margin:0;color:#e5e5e5;font-size:15px;line-height:1.6;white-space:pre-wrap;">${message}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #2a2630;">
                <p style="margin:0;color:#666;font-size:12px;">Evolure Labs · evolurelabs.com</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
`,
    // Envia uma cópia de confirmação ao cliente
    replyTo: email,
    });

    if (error) {
        console.error("Erro ao enviar email:", error);
        return new Response(JSON.stringify({ success: false, error: "Erro ao enviar email" }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
}