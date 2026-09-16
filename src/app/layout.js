import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL("https://anti-agency.in"),
  title: {
    default: "Anti-Agency | Brand & Digital Growth Agency",
    template: "%s | Anti-Agency",
  },
  description:
    "Anti-Agency is a global brand and digital growth agency engineering distinctive brand identities, bespoke websites, digital marketing, and AI content systems for ambitious companies worldwide.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://anti-agency.in",
    siteName: "Anti-Agency",
    title: "Anti-Agency | Brand & Digital Growth Agency",
    description:
      "Anti-Agency is a global brand and digital growth agency engineering distinctive brand identities, bespoke websites, digital marketing, and AI content systems for ambitious companies worldwide.",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 600,
        alt: "Anti-Agency Brand Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anti-Agency | Brand & Digital Growth Agency",
    description:
      "Global brand and digital growth agency engineering bespoke digital platforms and brand identities.",
    images: ["/logo.svg"],
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} dark h-full antialiased selection:bg-[#E40101] selection:text-white`}
    >
      <body className="min-h-full flex flex-col bg-[#09090b] text-zinc-100 font-sans">
        {children}
      </body>
    </html>
  );
}
