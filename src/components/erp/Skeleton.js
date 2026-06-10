import styles from "./Skeleton.module.css";

export function Skeleton({ width = "100%", height = 16, radius = 8, style }) {
  return <span className={styles.sk} style={{ width, height, borderRadius: radius, ...style }} />;
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className={styles.lines}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={`${90 - i * 12}%`} height={12} />
      ))}
    </div>
  );
}
