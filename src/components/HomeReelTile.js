"use client";

import { useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { ytPoster, ytPosterFallback } from "@/data/reels";
import styles from "./HomeReelTile.module.css";

export default function HomeReelTile({ reel, href = "/portfolio" }) {
  const [src, setSrc] = useState(ytPoster(reel));

  return (
    <Link href={href} className={styles.tile} aria-label={`${reel.title} — view in portfolio`}>
      <div className={styles.frame}>
        <img
          src={src}
          alt={`${reel.title} — ${reel.category}`}
          className={styles.image}
          loading="lazy"
          decoding="async"
          onError={() => setSrc(ytPosterFallback(reel))}
        />
        <span className={styles.grain} aria-hidden />
        <span className={styles.veil} aria-hidden />

        <span className={styles.playBtn} aria-hidden>
          <Play size={16} strokeWidth={2} fill="currentColor" />
        </span>

        <span className={styles.tag}>{reel.category}</span>
      </div>
      <div className={styles.meta}>
        <span className={styles.metaCat}>{reel.location}</span>
        <h4 className={styles.metaTitle}>{reel.title}</h4>
      </div>
    </Link>
  );
}
