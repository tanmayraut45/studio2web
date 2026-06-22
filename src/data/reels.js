// Real on-site walkthroughs from the Studio II YouTube channel
// https://youtube.com/@studio2_arch
//
// Order matters: the first entry tagged `ytType: "video"` becomes the
// Featured Walkthrough hero on /portfolio; `ytType: "short"` entries fill
// the "On Site" grid in array order.
//
// Slug → /projects/[slug]. YT id is the canonical identifier for the
// thumbnail (https://i.ytimg.com/vi/{id}/...) and the iframe player.

export const reels = [
  {
    id: "site",
    slug: "site",
    title: "Site",
    subtitle: "Featured Walkthrough",
    category: "Residence Walkthrough",
    location: "Pune, India",
    year: "2025",
    duration: "1:17",
    ytId: "bJOWk1p2YL0",
    ytUrl: "https://youtu.be/bJOWk1p2YL0",
    ytType: "video", // horizontal 16:9
    description:
      "A long-form walkthrough of a completed residence — every room, every detail. The space speaks for itself.",
    featured: true,
  },
  {
    id: "site-5",
    slug: "site-5",
    title: "Site 5",
    subtitle: "On Site",
    category: "Residence",
    location: "Pune, India",
    year: "2025",
    ytId: "OkDN91ui68A",
    ytUrl: "https://youtube.com/shorts/OkDN91ui68A",
    ytType: "short", // vertical 9:16
    description:
      "A bedroom composed of soft volumes and warm light — restraint as a design tool.",
  },
  {
    id: "site-4",
    slug: "site-4",
    title: "Site 4",
    subtitle: "On Site",
    category: "Kitchen",
    location: "Pune, India",
    year: "2025",
    ytId: "axvUJMuMRtI",
    ytUrl: "https://youtube.com/shorts/axvUJMuMRtI",
    ytType: "short",
    description:
      "A working kitchen designed as a quiet centerpiece — clean lines, considered materials.",
  },
  {
    id: "site-3",
    slug: "site-3",
    title: "Site 3",
    subtitle: "On Site",
    category: "Bedroom",
    location: "Pune, India",
    year: "2025",
    ytId: "hJjwUwucIno",
    ytUrl: "https://youtube.com/shorts/hJjwUwucIno",
    ytType: "short",
    description:
      "An intimate bedroom where light, texture and proportion meet without raising their voice.",
  },
  {
    id: "site-2",
    slug: "site-2",
    title: "Site 2",
    subtitle: "On Site",
    category: "Residence",
    location: "Pune, India",
    year: "2025",
    ytId: "fK4YDDhpoic",
    ytUrl: "https://youtube.com/shorts/fK4YDDhpoic",
    ytType: "short",
    description:
      "Calm, geometric, deliberately understated — a study in the discipline of finishing.",
  },
];

// YouTube CDN poster URLs.
//
// For vertical Shorts, `oar2.jpg` is the full-resolution 9:16 thumbnail
// (verified 200 for all 4 Shorts in this set). `maxresdefault.jpg` is
// 16:9 and exists for Shorts too but center-crops the vertical content
// — use it as the wide fallback for the long-form (where oar2 404s) and
// for hero treatments that want a 16:9 frame.
//
// `hqdefault.jpg` is the universal 200 fallback (480x360, letterboxed
// for Shorts).
export function ytPoster(reel) {
  if (reel.ytType === "short") {
    return `https://i.ytimg.com/vi/${reel.ytId}/oar2.jpg`;
  }
  // Long-form: maxres is not always present, sddefault is more reliable.
  return `https://i.ytimg.com/vi/${reel.ytId}/sddefault.jpg`;
}

export function ytPosterFallback(reel) {
  return `https://i.ytimg.com/vi/${reel.ytId}/hqdefault.jpg`;
}

// 16:9 wide poster (used by ReelHero even for shorts if we ever expose
// a wide hero treatment of a vertical reel).
export function ytPosterWide(reel) {
  return `https://i.ytimg.com/vi/${reel.ytId}/maxresdefault.jpg`;
}

// Channel + social references — single source of truth.
export const studioChannel = {
  youtube: "https://youtube.com/@studio2_arch",
  instagram: "https://www.instagram.com/studio_2_arch",
  instagramHandle: "@studio_2_arch",
};

export const featuredReel = reels.find((r) => r.featured) ?? reels[0];
export const shortReels = reels.filter((r) => r.ytType === "short");

export function getReel(slug) {
  return reels.find((r) => r.slug === slug);
}
