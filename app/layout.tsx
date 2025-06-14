import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PrimeReactProvider } from "primereact/api";
import "./globals.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import localFont from "next/font/local";
import StoreProvider from "./StoreProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--inter",
});

const square = localFont({
  src: [
    {
      path: "./fonts/SQR721B.woff",
      weight: "700",
    },
    {
      path: "./fonts/Square721N.otf",
      weight: "400",
    },
  ],
  display: "swap",
  variable: "--square",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://foodbank-theta.vercel.app/"),
  keywords: [
    "agriculture marketplace in Nigeria",
    "sell farm produce online Nigeria",
    "buy fresh farm produce Nigeria",
    "farm-to-market app Nigeria",
    "farm produce delivery app",
    "farmers app in Nigeria",
    "agritech platform Nigeria",
    "agriculture trading app",

    "connect farmers and buyers",
    "transport farm goods Nigeria",
    "agro e-commerce platform",
    "digital farming solution",
    "farm produce logistics",
    "food supply chain app",
    "fresh produce near me Nigeria",
    "local farm produce delivery",

    "how to sell farm products directly to buyers in Nigeria",
    "best app for farmers to sell crops",
    "affordable food delivery from farms",
    "connect with local transporters for farm delivery",
    "online platform for agricultural trade in Nigeria",
  ],
  title: {
    default: "Micro Food Bank",
    template: `%s | Micro Food Bank`,
  },
  openGraph: {
    description:
      "Discover a smart agriculture marketplace that connects Nigerian farmers, buyers, and transporters. List, buy, and deliver fresh farm produce easily across Nigeria. Empowering food supply with technology, trust, and speed.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-inter ${inter.variable} ${square.variable}`}>
        <StoreProvider>
          <PrimeReactProvider>{children}</PrimeReactProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
