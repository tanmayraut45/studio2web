import { Bodoni_Moda, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav"; // Will create next
import Footer from "@/components/Footer";
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling"; // Will create next

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"], // Variable font usually, but specific weights are safe
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: "Studio II | Modern Atelier",
  description:
    "High-end minimalist interior design services. Transforming spaces into experiences.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${bodoni.variable} ${jakarta.variable}`}>
        <SmoothScrolling>
          <Navbar />
          <main style={{ minHeight: "100vh", paddingBottom: "100px" }}>
            {children}
          </main>
          <Footer />
          <BottomNav />
        </SmoothScrolling>
      </body>
    </html>
  );
}
