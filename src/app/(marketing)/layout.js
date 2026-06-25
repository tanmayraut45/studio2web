import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import SmoothScrolling from "@/components/SmoothScrolling";
import BackToTop from "@/components/BackToTop";
import styles from "./layout.module.css";

export default function MarketingLayout({ children }) {
  return (
    <SmoothScrolling>
      <Navbar />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
      <BackToTop />
      <BottomNav />
    </SmoothScrolling>
  );
}
