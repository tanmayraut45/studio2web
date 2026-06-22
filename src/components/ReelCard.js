"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { ytPoster, ytPosterFallback } from "@/data/reels";
import styles from "./ReelCard.module.css";

export default function ReelCard({ reel, index = 0, onPlay }) {
  const [src, setSrc] = useState(ytPoster(reel));

  return (
    <motion.button
      type="button"
      className={styles.card}
      onClick={() => onPlay(reel)}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.06 * index,
      }}
      aria-label={`Play ${reel.title}`}
    >
      <div className={styles.frame}>
        <img
          src={src}
          alt={`${reel.title} — ${reel.category}`}
          className={styles.image}
          loading="lazy"
          decoding="async"
          onError={() => setSrc(ytPosterFallback(reel))}
        />
        <div className={styles.grain} aria-hidden />
        <div className={styles.gradient} aria-hidden />

        <span className={styles.playBtn} aria-hidden>
          <Play size={18} strokeWidth={2} fill="currentColor" />
        </span>

        <span className={styles.indexBadge} aria-hidden>
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className={styles.corner} data-pos="tl" aria-hidden />
        <span className={styles.corner} data-pos="br" aria-hidden />
      </div>

      <div className={styles.meta}>
        <div className={styles.metaTop}>
          <span className={styles.category}>{reel.category}</span>
          <span className={styles.year}>{reel.year}</span>
        </div>
        <h3 className={styles.title}>{reel.title}</h3>
        <span className={styles.location}>{reel.location}</span>
      </div>
    </motion.button>
  );
}
