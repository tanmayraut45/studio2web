"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import styles from "./ReelLightbox.module.css";

// Build YT embed URL with the cleanest player chrome the API allows.
// `playsinline=1` keeps mobile inline; `rel=0` removes related videos;
// `modestbranding=1` shrinks the YT logo; `controls=1` is required for
// users to scrub — fully hidden controls feel hostile.
function embedUrl(ytId) {
  const params = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    controls: "1",
    color: "white",
  });
  return `https://www.youtube.com/embed/${ytId}?${params.toString()}`;
}

export default function ReelLightbox({ reels, openIndex, onClose, onNavigate }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isOpen = openIndex != null && openIndex >= 0;
  const reel = isOpen ? reels[openIndex] : null;

  // Lock body scroll while the lightbox is open; restore on close.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Keyboard: ESC closes, arrows navigate between reels.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNavigate(1);
      else if (e.key === "ArrowLeft") onNavigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, onNavigate]);

  if (!mounted) return null;

  const node = (
    <AnimatePresence>
      {isOpen && reel && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${reel.title} walkthrough`}
        >
          <div className={styles.overlayGrain} aria-hidden />

          <motion.button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close walkthrough"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <X size={20} strokeWidth={1.5} />
          </motion.button>

          {reels.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.nav} ${styles.navPrev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(-1);
                }}
                aria-label="Previous walkthrough"
              >
                <ChevronLeft size={22} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className={`${styles.nav} ${styles.navNext}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(1);
                }}
                aria-label="Next walkthrough"
              >
                <ChevronRight size={22} strokeWidth={1.5} />
              </button>
            </>
          )}

          <motion.div
            className={styles.stage}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            key={reel.id}
          >
            <div
              className={`${styles.frame} ${
                reel.ytType === "video" ? styles.frameWide : styles.framePortrait
              }`}
            >
              <iframe
                src={embedUrl(reel.ytId)}
                title={reel.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            <div className={styles.caption}>
              <div className={styles.captionMeta}>
                <span className={styles.captionEyebrow}>{reel.subtitle}</span>
                <span className={styles.captionSep}>·</span>
                <span className={styles.captionLoc}>
                  {reel.location} <span className={styles.captionYear}>{reel.year}</span>
                </span>
              </div>
              <h3 className={styles.captionTitle}>{reel.title}</h3>
              <a
                href={reel.ytUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ytLink}
                onClick={(e) => e.stopPropagation()}
              >
                Watch on YouTube
                <ExternalLink size={14} strokeWidth={1.75} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(node, document.body);
}
