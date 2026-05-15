'use client';
import styles from './AIAvatar.module.css';

interface AIAvatarProps {
  state?: 'idle' | 'thinking' | 'speaking';
  size?: 'sm' | 'md' | 'lg';
}

export default function AIAvatar({ state = 'idle', size = 'md' }: AIAvatarProps) {
  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <div className={`${styles.glow} ${styles[`glow-${state}`]}`} />

      <div className={`${styles.robotContainer} ${styles[`robot-${state}`]}`}>
        <div className={styles.robotHead}>
          <div className={styles.antennaLeft} />
          <div className={styles.antennaRight} />

          <div className={styles.headInner}>
            <div className={styles.visor}>
              <div className={styles.eyeLeft}>
                <div className={styles.pupil} />
              </div>
              <div className={styles.eyeRight}>
                <div className={styles.pupil} />
              </div>
            </div>

            <div className={styles.mouthPanel}>
              <div className={`${styles.voiceLine} ${state === 'speaking' ? styles.animateVoice : ''}`} />
              <div className={`${styles.voiceLine} ${state === 'speaking' ? styles.animateVoice : ''}`} />
              <div className={`${styles.voiceLine} ${state === 'speaking' ? styles.animateVoice : ''}`} />
            </div>

            <div className={styles.circuitry} />
          </div>
        </div>

        <div className={styles.robotBody}>
          <div className={styles.neckConnector} />
          <div className={styles.shoulders} />
        </div>
      </div>

      <div className={styles.statusBadge}>
        <div className={styles.statusPulse} />
        <span>
          {state === 'thinking' ? 'SYSTEM ANALYZING...' : state === 'speaking' ? 'TRANSMITTING...' : 'ROBOTIC INTERVIEWER'}
        </span>
      </div>
    </div>
  );
}
