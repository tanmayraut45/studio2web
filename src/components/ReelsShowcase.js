"use client";

import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Youtube, ArrowUpRight } from "lucide-react";
import { reels, featuredReel, shortReels, studioChannel } from "@/data/reels";
import ReelHero from "./ReelHero";
import ReelCard from "./ReelCard";
import ReelLightbox from "./ReelLightbox";
import styles from "./ReelsShowcase.module.css";

export default function ReelsShowcase() {
  // The lightbox cycles through the FULL `reels` array so users can keep
  // arrow-navigating from the featured long-form into the shorts grid.
  const orderedReels = useMemo(() => reels, []);
  const [openIndex, setOpenIndex] = useState(null);

  const open = useCallback(
    (reel) => {
      const i = orderedReels.findIndex((r) => r.id === reel.id);
      setOpenIndex(i >= 0 ? i : null);
    },
    [orderedReels]
  );

  const close = useCallback(() => setOpenIndex(null), []);

  const navigate = useCallback(
    (delta) => {
      setOpenIndex((i) => {
        if (i == null) return i;
        const n = orderedReels.length;
        return (i + delta + n) % n;
      });
    },
    [orderedReels.length]
  );

  return (
    <>
      <ReelHero reel={featuredReel} onPlay={open} />

      <section className={styles.shortsSection} aria-labelledby="on-site-title">
        <motion.div
          className={styles.shortsHeader}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.shortsHeaderLeft}>
            <span className={styles.shortsEyebrow}>On Site</span>
            <h2 id="on-site-title" className={styles.shortsTitle}>
              Walkthroughs<span className={styles.shortsTitleItalic}> in motion.</span>
            </h2>
          </div>
          <p className={styles.shortsSub}>
            Filmed on completed projects.<br />
            Selected moments from each site.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {shortReels.map((reel, idx) => (
            <ReelCard key={reel.id} reel={reel} index={idx} onPlay={open} />
          ))}
        </div>
      </section>

      <motion.section
        className={styles.followBar}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.followInner}>
          <div className={styles.followText}>
            <span className={styles.followEyebrow}>More work</span>
            <h3 className={styles.followTitle}>
              Follow the studio for new sites every week.
            </h3>
          </div>
          <div className={styles.followActions}>
            <a
              href={studioChannel.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.followBtn} ${styles.followBtnPrimary}`}
            >
              <Instagram size={16} strokeWidth={1.75} />
              <span>{studioChannel.instagramHandle}</span>
              <span className={styles.followBtnArrow}>
                <ArrowUpRight size={14} />
              </span>
            </a>
            <a
              href={studioChannel.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.followBtn}
            >
              <Youtube size={16} strokeWidth={1.75} />
              <span>@studio2_arch</span>
              <span className={styles.followBtnArrow}>
                <ArrowUpRight size={14} />
              </span>
            </a>
          </div>
        </div>
      </motion.section>

      <ReelLightbox
        reels={orderedReels}
        openIndex={openIndex}
        onClose={close}
        onNavigate={navigate}
      />
    </>
  );
}
