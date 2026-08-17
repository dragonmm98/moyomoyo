import type { Metadata } from "next";
import { headers } from "next/headers";
import { LanguageProvider } from "./i18n/LanguageProvider";
import { assetUrl } from "./site-config";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = "Moyomoyo Baby Serum | Gentle Korean Skincare";
  const description = "Gentle Korean baby skincare for newborn and sensitive skin. Discover Moyomoyo’s lightweight daily serum for soothing, non-sticky moisture.";
  const socialImage = assetUrl("/og-social.png");

  return {
    title,
    description,
    metadataBase: new URL(origin),
    alternates: { canonical: origin },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
      url: origin,
      siteName: "Moyomoyo",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Moyomoyo gentle Korean baby skincare serum" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [socialImage] },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const sitewideJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: "Moyomoyo",
        url: origin,
        logo: assetUrl("/moyomoyo-logo.png"),
        description: "Gentle Korean skincare created for newborn and sensitive baby skin.",
        email: "hello@moyomoyo.co",
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin,
        name: "Moyomoyo",
        description: "Gentle Korean baby skincare for newborn and sensitive skin.",
        publisher: { "@id": `${origin}/#organization` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sitewideJsonLd).replace(/</g, "\\u003c") }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
