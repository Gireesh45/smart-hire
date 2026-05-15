'use client';
import styles from './Waveform.module.css';

interface WaveformProps {
  active: boolean;
  color?: 'indigo' | 'cyan' | 'green';
  bars?: number;
}

export default function Waveform({ active, color = 'indigo', bars = 20 }: WaveformProps) {
  return (
    <div className={`${styles.container} ${active ? styles.active : styles.inactive}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`${styles.bar} ${styles[color]}`}
          style={{ animationDelay: `${(i * 0.05) % 0.8}s` }}
        />
      ))}
    </div>
  );
}
