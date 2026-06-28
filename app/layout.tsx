import MetaPixelProvider from "./components/MetaPixelProvider";
import { Syne, DM_Sans } from "next/font/google";
// import "./webstudio.css";
import type { Metadata } from "next";
import WAFab from "./components/WAFab";
// import Image from "next/image";
const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});
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
    <html lang="pt" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="ws">
        <MetaPixelProvider pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID!} />
        {children}
        <WAFab />
      </body>
    </html>
  );
}
