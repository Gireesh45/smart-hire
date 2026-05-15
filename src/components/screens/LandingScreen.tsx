'use client';
import { useState } from 'react';
import { Brain, Clock, Shield, Zap, Star, ChevronRight, Play, Users, Award, CheckCircle } from 'lucide-react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import styles from './LandingScreen.module.css';

interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const features = [
    { icon: Brain, title: 'AI-Powered Evaluation', desc: 'Advanced NLP analyzes your responses for clarity, depth, and relevance in real-time.', color: 'indigo' },
    { icon: Shield, title: 'Bias-Free Assessment', desc: 'Standardized evaluation criteria ensure every candidate gets a fair, equal opportunity.', color: 'cyan' },
    { icon: Zap, title: 'Instant Feedback', desc: 'Receive comprehensive feedback and scores within minutes of completing your interview.', color: 'amber' },
  ];

  const steps = [
    { num: '01', title: 'Setup Your Profile', desc: 'Fill in your details and the role you are applying for.' },
    { num: '02', title: 'Check Requirements', desc: 'Verify your camera, microphone, and internet connection.' },
    { num: '03', title: 'Meet Your AI Interviewer', desc: 'Answer behavioral and technical questions naturally.' },
    { num: '04', title: 'Get Your Results', desc: 'Receive a detailed evaluation report within minutes.' },
  ];

  const stats = [
    { value: '50K+', label: 'Interviews Conducted', icon: Users },
    { value: '94%', label: 'Candidate Satisfaction', icon: Star },
    { value: '3x', label: 'Faster Hiring Process', icon: Zap },
    { value: '200+', label: 'Companies Trust Us', icon: Award },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
        <div className={styles.bgGrid} />
      </div>

      <header className={styles.header}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <Brain size={20} />
            </div>
            <span className={styles.logoText}>Interview<span className="text-gradient">AI</span></span>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.headerTag}>
              <span className="status-dot online" />
              System Online
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroBadge}>
              <Star size={12} />
              AI-Powered Interviews · Trusted by 200+ Companies
            </div>
            <h1 className={styles.heroTitle}>
              Your Interview,
              <br />
              <span className="text-gradient">Reimagined by AI</span>
            </h1>
            <p className={styles.heroDesc}>
              InterviewAI conducts intelligent, structured interviews that evaluate your skills objectively.
              No scheduling conflicts, no unconscious bias — just fair, insightful assessment.
            </p>

            <div className={styles.heroCtas}>
              <button
                id="start-interview-btn"
                className="btn btn-primary btn-lg"
                onClick={onStart}
              >
                <Play size={18} />
                Start Interview
                <ChevronRight size={18} />
              </button>
              <div className={styles.heroDuration}>
                <Clock size={14} />
                Estimated duration: <strong>30–45 minutes</strong>
              </div>
            </div>

            <div className={styles.heroInstructions}>
              <h3 className={styles.instrTitle}>Before you begin</h3>
              <div className={styles.instrList}>
                {[
                  'Ensure you are in a quiet, well-lit environment',
                  'Have a stable internet connection ready',
                  'Your camera and microphone must be enabled',
                  'Use a laptop or desktop for the best experience',
                  'Have your resume ready to upload',
                ].map((item, i) => (
                  <div key={i} className={styles.instrItem}>
                    <CheckCircle size={14} className={styles.instrIcon} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.statsSection}>
          <div className="container">
            <div className={styles.statsGrid}>
              {stats.map(({ value, label, icon: Icon }, i) => (
                <div key={i} className={styles.statCard}>
                  <Icon size={20} className={styles.statIcon} />
                  <div className={styles.statValue}>{value}</div>
                  <div className={styles.statLabel}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Why <span className="text-gradient">InterviewAI</span>?</h2>
              <p className={styles.sectionDesc}>The most advanced AI interview platform built for the modern hiring process.</p>
            </div>
            <div className={styles.featuresGrid}>
              {features.map(({ icon: Icon, title, desc, color }, i) => (
                <div
                  key={i}
                  className={`${styles.featureCard} glass-card`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className={`${styles.featureIcon} ${styles[`featureIcon-${color}`]}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className={styles.featureTitle}>{title}</h3>
                  <p className={styles.featureDesc}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.stepsSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>How It <span className="text-gradient">Works</span></h2>
              <p className={styles.sectionDesc}>Four simple steps to complete your AI interview.</p>
            </div>
            <div className={styles.stepsGrid}>
              {steps.map(({ num, title, desc }, i) => (
                <div key={i} className={styles.stepCard}>
                  <div className={styles.stepNum}>{num}</div>
                  <div className={styles.stepConnector} style={{ display: i < steps.length - 1 ? 'block' : 'none' }} />
                  <h3 className={styles.stepTitle}>{title}</h3>
                  <p className={styles.stepDesc}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaCard}>
              <div className={styles.ctaOrb} />
              <h2 className={styles.ctaTitle}>Ready to Showcase Your Skills?</h2>
              <p className={styles.ctaDesc}>Join thousands of candidates who have completed their AI interview in under 45 minutes.</p>
              <button
                id="start-interview-bottom-btn"
                className="btn btn-primary btn-lg"
                onClick={onStart}
              >
                <Play size={18} />
                Start Your Interview Now
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <span>© 2026 Interview AI · All rights reserved</span>
          <span className={styles.footerRight}>Built for the future of hiring — by Gireesh Kumar</span>
        </div>
      </footer>
    </div>
  );
}
