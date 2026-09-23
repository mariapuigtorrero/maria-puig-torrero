import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/siteUrl";
import { Archivo } from "next/font/google";
import "../globals.css";
import { SanityLive } from "@/sanity/lib/live";
import { draftMode } from "next/headers";
import Header from "../_components/Header";
import Footer from "../_components/Footer";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "100",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "María Puig Torrero — Photographer, Creative & Art Director",
  description:
    "María Puig Torrero is a Spanish based Photographer, Creative and Art Director.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { isEnabled: isDraftMode } = await draftMode();
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body>
        <div
          style={{ display: 'none' }}
          dangerouslySetInnerHTML={{
            __html: `<!--
  Code and Design by Elvis Fabricio
  2026
  instagram.com/donthillhere
-->`,
          }}
        />
        <Header />
        {children}
        <Footer />
        <SanityLive />
        {isDraftMode && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: '#000', padding: '0.5rem 1rem', textAlign: 'center', fontSize: '0.75rem', color: '#fff' }}>
            <span style={{ color: '#fff' }}>Estás viendo una vista previa (borrador sin publicar).</span>
            <a href="/api/draft-mode/disable" style={{ textDecoration: 'underline', color: '#fff' }}>
              Salir de la vista previa
            </a>
          </div>
        )}
      </body>
    </html>
  );
}