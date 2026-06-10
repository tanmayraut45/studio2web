import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import SmoothScrolling from "@/components/SmoothScrolling";

export default function MarketingLayout({ children }) {
  return (
    <SmoothScrolling>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingBottom: "calc(100px + env(safe-area-inset-bottom))" }}>
        {children}
      </main>
      <Footer />
      <BottomNav />
    </SmoothScrolling>
  );
}
