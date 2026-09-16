import { Bebas_Neue, Inter, Playfair_Display } from "next/font/google";
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
  title: "Anti-Agency | Brand Building, Web Design & Digital Agency",
  description:
    "Build a memorable brand with Anti-Agency. We offer website design, branding, social media, video production, AI content, and brand strategy across US, UK, India, Australia, and Dubai.",
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

