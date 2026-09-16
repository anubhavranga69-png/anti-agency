export const metadata = {
  title: "The Journal | Brand Strategy & Digital Craft",
  description:
    "Unfiltered perspectives on brand engineering, bespoke digital craft, and modern market dominance from the Anti-Agency collective.",
  alternates: {
    canonical: "/blog/",
  },
  openGraph: {
    title: "Anti-Agency Journal | Brand Strategy & Digital Craft",
    description:
      "Unfiltered perspectives on brand engineering, bespoke digital craft, and modern market dominance.",
    url: "https://anti-agency.in/blog/",
    siteName: "Anti-Agency",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 800,
        height: 600,
        alt: "Anti-Agency Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anti-Agency Journal | Brand Strategy & Digital Craft",
    description:
      "Unfiltered perspectives on brand engineering, bespoke digital craft, and modern market dominance.",
    images: ["/logo.svg"],
  },
};

export default function BlogLayout({ children }) {
  return children;
}
