"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Clock3 } from "lucide-react";
import { ytPoster, ytPosterFallback } from "@/data/reels";
import styles from "./ReelHero.module.css";

export default function ReelHero({ reel, onPlay }) {
  // ytPoster returns sddefault for the long-form (maxresdefault is unreliable
  // for older uploads). Falls back to hqdefault on error.
  const [src, setSrc] = useState(ytPoster(reel));

  return (
    <motion.section
      className={styles.hero}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      aria-label={`${reel.title} featured walkthrough`}
    >
      <button
        type="button"
        className={styles.frame}
        onClick={() => onPlay(reel)}
        aria-label={`Play ${reel.title}`}
      >
        <div className={styles.imageWrap}>
          <img
            src={src}
            alt={`${reel.title} — featured walkthrough poster`}
            className={styles.image}
            loading="eager"
            decoding="async"
            onError={() => setSrc(ytPosterFallback(reel))}
          />
          <div className={styles.imageGrain} aria-hidden />
          <div className={styles.gradient} aria-hidden />
        </div>

        <div className={styles.scanline} aria-hidden />

        <div className={styles.content}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden />
            <span>{reel.subtitle}</span>
            {reel.duration && (
              <>
                <span className={styles.eyebrowSep} aria-hidden>·</span>
                <span className={styles.eyebrowDur}>
                  <Clock3 size={11} strokeWidth={2} /> {reel.duration}
                </span>
              </>
            )}
          </div>

          <h2 className={styles.title}>{reel.title}</h2>

          <div className={styles.meta}>
            <span>{reel.category}</span>
            <span className={styles.metaSep}>·</span>
            <span>{reel.location}</span>
            <span className={styles.metaSep}>·</span>
            <span>{reel.year}</span>
          </div>
        </div>

        <span className={styles.playRing} aria-hidden>
          <span className={styles.play}>
            <Play size={22} strokeWidth={1.8} fill="currentColor" />
          </span>
        </span>

        <span className={styles.corner} data-pos="tl" aria-hidden />
        <span className={styles.corner} data-pos="tr" aria-hidden />
        <span className={styles.corner} data-pos="bl" aria-hidden />
        <span className={styles.corner} data-pos="br" aria-hidden />
      </button>
    </motion.section>
  );
}
