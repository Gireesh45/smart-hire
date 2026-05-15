'use client';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className={styles.track}>
        <span className={`${styles.thumb} ${theme === 'light' ? styles.thumbLight : ''}`}>
          {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
        </span>
      </span>
    </button>
  );
}
