import type { Metadata } from "next";
import "./webstudio.css";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Evolure Web Studio — Sites que vendem. Código que dura.",
  description:
    "Desenvolvedor full-stack de Maputo. Landing pages, sites completos, e-commerce e soluções personalizadas para marcas que querem crescer.",
};

export default function WebStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
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
      <body className="ws">{children}</body>
    </html>
  );
}
