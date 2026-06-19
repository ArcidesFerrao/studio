import "./webstudio.css";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Web Studio — Sites Profissionais em Maputo | Evolure Labs",
  description:
    "Criamos landing pages e websites profissionais para negócios em Moçambique. Entrega em 5–7 dias a partir de 5.555 MZN. Orçamento gratuito em 24h.",
  keywords: [
    "web studio moçambique",
    "criar site maputo",
    "landing page moçambique",
    "website profissional maputo",
    "desenvolvimento web moçambique",
    "sites para negócios maputo",
    "criar website moçambique",
    "evolure labs",
  ],
  authors: [{ name: "Evolure Labs", url: "https://evolurelabs.com" }],
  creator: "Evolure Labs",
  publisher: "Evolure Labs",

  metadataBase: new URL("https://webstudio.evolurelabs.com"),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://webstudio.evolurelabs.com",
    title: "Web Studio — Sites Profissionais em Maputo",
    description:
      "Landing pages e websites profissionais para negócios em Moçambique. Entrega em 5–7 dias a partir de 5.555 MZN.",
    siteName: "Web Studio by Evolure Labs",
    locale: "pt_MZ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Web Studio — Sites profissionais para negócios em Maputo, Moçambique",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Web Studio — Sites Profissionais em Maputo",
    description:
      "Landing pages e websites para negócios em Moçambique. A partir de 4.500 MZN.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },

  verification: {
    google: "GOOGLE_SEARCH_CONSOLE_TOKEN",
  },
};

export default function WebStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <head>
        <script>
          {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1677909396804331');
          fbq('track', 'PageView');
        `}
        </script>
        <noscript>
          <Image
            height="1"
            width="1"
            alt="pixel"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1677909396804331&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className="ws">
        {children}

        <a
          href="https://wa.me/258852740554?text=Olá%2C+Vi+o+vosso+anúncio+sobre+a+landing+page+de+7.500+MZN.+Tenho+um+[negocio]+em+[bairro].+Como+funciona?"
          className="text-xs  fixed bottom-10 right-6 z-50  flex items-center justify-center gap-2 bg-[#25D366] text-[#0B0F1C] font-bold px-3 py-2 rounded-full shadow-lg md:hidden "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.25rem"
            height="1.25rem"
            viewBox="0 0 24 24"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              fill="currentColor"
              d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"
            />
          </svg>
          WhatsApp · Resposta em {"<24h"}
        </a>
      </body>
    </html>
  );
}
