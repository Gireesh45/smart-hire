'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, Download, RotateCcw, Brain, Star, TrendingUp, TrendingDown, Clock, MessageSquare, Code, Award } from 'lucide-react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import styles from './SummaryScreen.module.css';

interface SummaryScreenProps {
  candidateName: string;
  role: string;
  questionsAttempted: number;
  totalQuestions: number;
  timeTaken: number;
  performanceScore: number;
  codingScore: number;
  onRestart: () => void;
}

function calcScores(verbalScore: number, codingScore: number) {
  const overall = Math.round((verbalScore * 0.6) + (codingScore * 0.4));

  const variance = () => Math.round((Math.random() - 0.5) * 6);

  const competencies = [
    Math.min(99, Math.max(5, (codingScore * 0.7 + verbalScore * 0.3) + variance())),
    Math.min(99, Math.max(5, verbalScore + 4 + variance())),
    Math.min(99, Math.max(5, (codingScore * 0.8 + verbalScore * 0.2) + variance())),
    Math.min(99, Math.max(5, verbalScore + 6 + variance())),
    Math.min(99, Math.max(5, verbalScore - 8 + variance())),
  ];

  return { overall, competencies };
}

function getEvalText(score: number, answered: number): string {
  if (answered === 0) {
    return "No responses were recorded. Evaluation impossible.";
  }

  if (score < 30) {
    return "Critical: The answers provided were extremely brief or lacked substance. This typically indicates a lack of preparation or understanding of the core concepts. We strongly recommend thorough review before re-applying.";
  } else if (score < 60) {
    return "The responses were somewhat limited. While you attempted the questions, the depth of technical explanation was insufficient. Try to provide more concrete examples and detailed reasoning in your future interviews.";
  } else if (score < 85) {
    return "Solid performance. Your answers were clear and demonstrated good knowledge. You provide sufficient detail for most topics, though some advanced technical areas could be explored further.";
  } else {
    return "Outstanding performance. Your answers were comprehensive, technical, and well-structured. You demonstrated both depth of knowledge and excellent communication skills throughout the session.";
  }
}

function getFeedback(score: number) {
  if (score < 40) {
    return {
      strengths: ['Participated in Session'],
      improvements: ['Detailed Explanations', 'Technical Depth', 'Concrete Examples', 'Preparation'],
    };
  } else if (score < 75) {
    return {
      strengths: ['Communication Clarity', 'Structured Thinking'],
      improvements: ['Advanced Concepts', 'Real-world Examples', 'Code Optimization'],
    };
  } else {
    return {
      strengths: ['Technical Knowledge', 'Strategic Thinking', 'Excellent Communication', 'Problem Solving'],
      improvements: ['System Design Scale', 'Edge Case Analysis'],
    };
  }
}

const COMPETENCY_LABELS = ['Technical Skills', 'Communication', 'Problem Solving', 'Cultural Fit', 'Leadership'];


function Confetti() {
  const colors = ['#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];
  return (
    <div className={styles.confettiContainer} aria-hidden="true">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className={styles.confettiPiece}
          style={{
            left: `${Math.random() * 100}%`,
            background: colors[i % colors.length],
            width: `${6 + Math.random() * 6}px`,
            height: `${6 + Math.random() * 6}px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

export default function SummaryScreen({ candidateName, role, questionsAttempted, totalQuestions, timeTaken, performanceScore, codingScore, onRestart }: SummaryScreenProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [computed, setComputed] = useState({ overall: 0, competencies: [0, 0, 0, 0, 0] });
  const [scores, setScores] = useState([0, 0, 0, 0, 0]);
  const [overallScore, setOverallScore] = useState(0);

  useEffect(() => {
    const calc = calcScores(performanceScore, codingScore);
    setComputed(calc);
    setIsMounted(true);

    const t = setTimeout(() => {
      setScores(calc.competencies);
    }, 500);
    return () => clearTimeout(t);
  }, [performanceScore, codingScore]);

  const targetOverall = computed.overall;
  const aiEvalText = getEvalText(targetOverall, questionsAttempted);
  const { strengths, improvements } = getFeedback(targetOverall);
  const showConfetti = isMounted && targetOverall >= 80;

  useEffect(() => {
    if (scores[0] > 0) {
      let current = 0;
      const interval = setInterval(() => {
        current += 2;
        if (current >= targetOverall) { setOverallScore(targetOverall); clearInterval(interval); }
        else setOverallScore(current);
      }, 20);
      return () => clearInterval(interval);
    }
  }, [scores[0]]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const scoreGrade = overallScore >= 80 ? 'Excellent' : overallScore >= 55 ? 'Good' : overallScore >= 30 ? 'Needs Improvement' : 'Incomplete';
  const scoreColor = overallScore >= 80 ? 'var(--accent-green)' : overallScore >= 55 ? 'var(--accent-amber)' : 'var(--accent-red)';
  const heroTitle = questionsAttempted === 0 ? 'Interview Ended' : questionsAttempted < totalQuestions * 0.5 ? 'Session Recorded' : 'Well done,';

  if (!isMounted) {
    return (
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Analyzing performance data...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {showConfetti && <Confetti />}

      <div className={styles.bg}><div className={styles.bgOrb} /></div>

      <header className={styles.header}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className={styles.logo}><div className={styles.logoIcon}><Brain size={18} /></div><span>Interview<span className="text-gradient">AI</span></span></div>
          <ThemeToggle />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.wrapper}>
          <div className={styles.heroSection}>
            <div className={styles.heroIcon} style={{ background: overallScore >= 55 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.1)', borderColor: overallScore >= 55 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.3)', color: overallScore >= 55 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              <CheckCircle size={40} />
            </div>
            <div className={styles.heroBadge}>
              <Award size={13} />
              Interview Complete
            </div>
            <h1 className={styles.heroTitle}>
              {heroTitle} <span className="text-gradient">{candidateName || 'Candidate'}</span>!
            </h1>
            <p className={styles.heroDesc}>
              Your interview for <strong>{role || 'the applied role'}</strong> has been submitted. {questionsAttempted === 0 ? 'No answers were recorded.' : `You answered ${questionsAttempted} of ${totalQuestions} questions.`}
            </p>
            <div className={styles.submittedBadge}>
              <CheckCircle size={14} />
              Submitted for Review
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.left}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={`${styles.statIcon} ${styles.statIconGreen}`}><MessageSquare size={18} /></div>
                  <div className={styles.statValue}>{questionsAttempted}/{totalQuestions}</div>
                  <div className={styles.statLabel}>Questions Answered</div>
                </div>
                <div className={styles.statCard}>
                  <div className={`${styles.statIcon} ${styles.statIconCyan}`}><Clock size={18} /></div>
                  <div className={styles.statValue}>{formatTime(timeTaken > 0 ? timeTaken : 0)}</div>
                  <div className={styles.statLabel}>Time Taken</div>
                </div>
                <div className={styles.statCard}>
                  <div className={`${styles.statIcon} ${styles.statIconPurple}`}><Code size={18} /></div>
                  <div className={styles.statValue}>
                    {codingScore === 100 ? 'Passed' : codingScore >= 20 ? 'Attempted' : 'Skipped'}
                  </div>
                  <div className={styles.statLabel}>Coding Challenge</div>
                </div>
                <div className={styles.statCard}>
                  <div className={`${styles.statIcon} ${styles.statIconAmber}`}><Star size={18} /></div>
                  <div className={styles.statValue} style={{ color: scoreColor }}>{overallScore}%</div>
                  <div className={styles.statLabel}>Overall Score</div>
                </div>
              </div>

              <div className={styles.evalCard}>
                <div className={styles.evalHeader}>
                  <Brain size={16} className={styles.evalIcon} />
                  <h2 className={styles.evalTitle}>AI Evaluation</h2>
                  <span className={`badge ${overallScore >= 80 ? 'badge-green' : overallScore >= 55 ? 'badge-amber' : 'badge-red'}`}>{scoreGrade}</span>
                </div>
                <p className={styles.evalText}>{aiEvalText}</p>
              </div>

              <div className={styles.feedbackGrid}>
                <div className={styles.feedbackCard}>
                  <div className={styles.feedbackHeader}>
                    <TrendingUp size={16} style={{ color: 'var(--accent-green)' }} />
                    <h3>Strengths</h3>
                  </div>
                  <div className={styles.tagList}>
                    {strengths.map(s => (
                      <span key={s} className={`badge badge-green ${styles.feedbackTag}`}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.feedbackCard}>
                  <div className={styles.feedbackHeader}>
                    <TrendingDown size={16} style={{ color: 'var(--accent-amber)' }} />
                    <h3>Improvement Areas</h3>
                  </div>
                  <div className={styles.tagList}>
                    {improvements.map(s => (
                      <span key={s} className={`badge badge-amber ${styles.feedbackTag}`}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.competencyCard}>
                <h2 className={styles.competencyTitle}>Competency Scores</h2>
                <div className={styles.overallScore}>
                  <div className={styles.overallRing}>
                    <svg viewBox="0 0 120 120" className={styles.overallSvg}>
                      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
                      <circle
                        cx="60" cy="60" r="50"
                        fill="none"
                        stroke={scoreColor}
                        strokeWidth="8"
                        strokeDasharray={`${(overallScore / 100) * 314} 314`}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                        style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1)', filter: `drop-shadow(0 0 8px ${scoreColor})` }}
                      />
                    </svg>
                    <div className={styles.overallCenter}>
                      <span className={styles.overallNum} style={{ color: scoreColor }}>{overallScore}</span>
                      <span className={styles.overallLabel}>/ 100</span>
                      <span className={styles.overallGrade} style={{ color: scoreColor }}>{scoreGrade}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.competencies}>
                  {COMPETENCY_LABELS.map((label, i) => (
                    <div key={i} className={styles.competencyRow}>
                      <div className={styles.compLabel}>{label}</div>
                      <div className={styles.compBarTrack}>
                        <div
                          className={styles.compBarFill}
                          style={{
                            width: `${scores[i]}%`,
                            background: scores[i] >= 80 ? 'var(--accent-green)' : scores[i] >= 60 ? 'var(--gradient-primary)' : scores[i] >= 35 ? 'var(--accent-amber)' : 'var(--accent-red)',
                            transition: `width 1s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.1}s`,
                          }}
                        />
                      </div>
                      <span className={styles.compScore}>{scores[i]}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.actionBtns}>
                <button id="download-report-btn" className="btn btn-secondary" style={{ width: '100%' }}>
                  <Download size={15} />
                  Download Report
                </button>
                <button id="restart-btn" className="btn btn-ghost btn-sm" onClick={onRestart} style={{ width: '100%' }}>
                  <RotateCcw size={14} />
                  Start New Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
