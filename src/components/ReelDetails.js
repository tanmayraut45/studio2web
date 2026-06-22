"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Instagram, Youtube, ArrowUpRight, Play } from "lucide-react";
import {
  reels,
  ytPoster,
  ytPosterFallback,
  studioChannel,
} from "@/data/reels";
import styles from "./ReelDetails.module.css";

function embedUrl(ytId) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    controls: "1",
    color: "white",
  });
  return `https://www.youtube.com/embed/${ytId}?${params.toString()}`;
}

export default function ReelDetails({ reel }) {
  const [playing, setPlaying] = useState(false);
  // ytPoster picks the best aspect-matching URL per ytType (oar2 vertical
  // for shorts, sddefault for long-form). hqdefault is the onError fallback.
  const [posterSrc, setPosterSrc] = useState(ytPoster(reel));

  // Sibling reels for the "Continue" strip at the bottom.
  const others = useMemo(
    () => reels.filter((r) => r.id !== reel.id),
    [reel.id]
  );

  const isWide = reel.ytType === "video";

  return (
    <div className={styles.page}>
      {/* Atmospheric backdrop: the poster, softened + blurred. */}
      <div className={styles.atmosphere} aria-hidden>
        <img src={posterSrc} alt="" className={styles.atmosphereImg} />
        <div className={styles.atmosphereVeil} />
      </div>

      <div className={`container ${styles.container}`}>
        <motion.div
          className={styles.topRow}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/portfolio" className={styles.back}>
            <ArrowLeft size={16} strokeWidth={1.75} />
            <span>All work</span>
          </Link>

          <span className={styles.crumb}>
            <span className={styles.crumbDot} aria-hidden />
            {reel.subtitle}
          </span>
        </motion.div>

        <motion.header
          className={styles.header}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
        >
          <motion.span
            className={styles.category}
            variants={{
              hidden: { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
            }}
          >
            {reel.category}
          </motion.span>

          <motion.h1
            className={styles.title}
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            {reel.title}
          </motion.h1>

          <motion.div
            className={styles.metaRow}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.6 } },
            }}
          >
            <span>{reel.location}</span>
            <span className={styles.metaSep}>·</span>
            <span>{reel.year}</span>
            {reel.duration && (
              <>
                <span className={styles.metaSep}>·</span>
                <span>{reel.duration}</span>
              </>
            )}
          </motion.div>
        </motion.header>

        <div
          className={`${styles.contentLayout} ${
            isWide ? styles.layoutWide : styles.layoutPortrait
          }`}
        >
          {/* The stage is the page's whole point — keep it as static HTML
             so it never depends on a JS animation firing. The interior
             poster/iframe handles their own gold-button micro-interactions. */}
          <section
            className={`${styles.stage} ${isWide ? styles.stageWide : styles.stagePortrait}`}
          >
            <div className={styles.player}>
              {!playing ? (
                <button
                  type="button"
                  className={styles.poster}
                  onClick={() => setPlaying(true)}
                  aria-label={`Play ${reel.title}`}
                >
                  <img
                    src={posterSrc}
                    alt={`${reel.title} poster`}
                    className={styles.posterImg}
                    loading="eager"
                    decoding="async"
                    onError={() => setPosterSrc(ytPosterFallback(reel))}
                  />
                  <span className={styles.posterGrain} aria-hidden />
                  <span className={styles.posterVeil} aria-hidden />
                  <span className={styles.posterPlayRing} aria-hidden>
                    <span className={styles.posterPlay}>
                      <Play size={26} strokeWidth={1.8} fill="currentColor" />
                    </span>
                  </span>
                </button>
              ) : (
                <iframe
                  src={`${embedUrl(reel.ytId)}&autoplay=1`}
                  title={reel.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className={styles.iframe}
                />
              )}
            </div>
          </section>

          <section className={styles.body}>
          <motion.div
            className={styles.description}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          >
            <span className={styles.descEyebrow}>Notes from site</span>
            <p>{reel.description}</p>
            <p className={styles.descSecondary}>
              Every space we deliver is documented on camera, raw and unstaged.
              The reel is what you would see if you walked the room with us.
            </p>
          </motion.div>

          <motion.aside
            className={styles.sidebar}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          >
            <Stat label="Discipline" value={reel.category} />
            <Stat label="Location" value={reel.location} />
            <Stat label="Year" value={reel.year} />
            {reel.duration && <Stat label="Length" value={reel.duration} />}

            <div className={styles.ctaStack}>
              <a
                href={reel.ytUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.cta} ${styles.ctaPrimary}`}
              >
                <Youtube size={16} strokeWidth={1.75} />
                <span>Watch on YouTube</span>
                <span className={styles.ctaArrow}>
                  <ArrowUpRight size={14} />
                </span>
              </a>
              <a
                href={studioChannel.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cta}
              >
                <Instagram size={16} strokeWidth={1.75} />
                <span>{studioChannel.instagramHandle}</span>
                <span className={styles.ctaArrow}>
                  <ArrowUpRight size={14} />
                </span>
              </a>
            </div>
          </motion.aside>
        </section>
        </div>

        {others.length > 0 && (
          <section className={styles.continue}>
            <div className={styles.continueHeader}>
              <span className={styles.continueEyebrow}>
                <span className={styles.continueLine} aria-hidden /> Continue
              </span>
              <h3 className={styles.continueTitle}>More from site</h3>
            </div>

            <div className={styles.continueGrid}>
              {others.slice(0, 3).map((r) => (
                <ContinueCard key={r.id} reel={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

function ContinueCard({ reel }) {
  const [src, setSrc] = useState(ytPoster(reel));
  return (
    <Link href={`/projects/${reel.slug}`} className={styles.cCard}>
      <div className={styles.cFrame}>
        <img
          src={src}
          alt={reel.title}
          className={styles.cImg}
          loading="lazy"
          decoding="async"
          onError={() => setSrc(ytPosterFallback(reel))}
        />
        <span className={styles.cVeil} aria-hidden />
        <span className={styles.cPlay} aria-hidden>
          <Play size={14} strokeWidth={2} fill="currentColor" />
        </span>
      </div>
      <div className={styles.cMeta}>
        <span className={styles.cCat}>{reel.category}</span>
        <span className={styles.cTitle}>{reel.title}</span>
      </div>
    </Link>
  );
}
