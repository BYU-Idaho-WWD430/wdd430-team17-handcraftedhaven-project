import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./ui/styles/globals.css";
//import Header from "./ui/Header";
import Footer from "./ui/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Handcrafted Haven",
  description:
    "Your curated marketplace for authentic, artisan-made creations.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {/* <Header /> */}
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
