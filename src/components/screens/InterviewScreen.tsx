'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Mic, SkipForward, Send, StopCircle, ChevronRight, MessageSquare, AlertTriangle, Clock, Brain, Volume2, VolumeX } from 'lucide-react';
import AIAvatar from '@/components/shared/AIAvatar';
import Waveform from '@/components/shared/Waveform';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { useTimer } from '@/hooks/useTimer';
import { useTabWarning } from '@/hooks/useTabWarning';
import styles from './InterviewScreen.module.css';

interface InterviewScreenProps {
  candidateName: string;
  role: string;
  experience: string;
  skills: string[];
  resumeName: string;
  onEnd: (data: InterviewResult) => void;
}

interface InterviewResult {
  questionsAttempted: number;
  totalQuestions: number;
  timeTaken: number;
  performanceScore: number;
  codingScore: number;
  transcript: string[];
}

interface Question {
  id: number;
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Technical' | 'Behavioral';
  roles: string[];
  tags: string[];
}

const QUESTION_BANK: Question[] = [
  { id: 1, text: "Please introduce yourself and tell me what motivates you as a ${ROLE}?", difficulty: 'Easy', category: 'Behavioral', roles: ['any'], tags: ['general'] },
  { id: 2, text: "Tell me about a time you had to learn a new technology very quickly. How did you approach it?", difficulty: 'Easy', category: 'Behavioral', roles: ['any'], tags: ['general'] },
  { id: 3, text: "Describe a complex technical challenge you solved. How did you communicate the solution to your team?", difficulty: 'Medium', category: 'Behavioral', roles: ['any'], tags: ['general'] },

  { id: 10, text: "What is the difference between 'localStorage' and 'sessionStorage'?", difficulty: 'Easy', category: 'Technical', roles: ['frontend', 'fullstack'], tags: ['javascript'] },
  { id: 11, text: "How do you optimize images for a web application to improve performance?", difficulty: 'Easy', category: 'Technical', roles: ['frontend', 'fullstack'], tags: ['performance'] },
  { id: 12, text: "What is the purpose of 'Alt' text in images, and why is it important for SEO and accessibility?", difficulty: 'Easy', category: 'Technical', roles: ['frontend'], tags: ['general'] },
  { id: 13, text: "Can you explain the difference between 'absolute' and 'relative' positioning in CSS?", difficulty: 'Easy', category: 'Technical', roles: ['frontend'], tags: ['css'] },
  { id: 14, text: "In React, what are the key rules you must follow when using Hooks?", difficulty: 'Easy', category: 'Technical', roles: ['frontend'], tags: ['react'] },

  { id: 20, text: "What is the 'Closure' concept in JavaScript, and can you give an example of how it's useful?", difficulty: 'Medium', category: 'Technical', roles: ['frontend', 'fullstack'], tags: ['javascript'] },
  { id: 21, text: "Explain the React lifecycle methods and how they correspond to the useEffect hook.", difficulty: 'Medium', category: 'Technical', roles: ['frontend'], tags: ['react'] },
  { id: 22, text: "What is 'Debouncing' and 'Throttling' in the context of event handling?", difficulty: 'Medium', category: 'Technical', roles: ['frontend'], tags: ['javascript'] },
  { id: 23, text: "How do you handle 'CORS' errors when your frontend tries to fetch data from a different domain?", difficulty: 'Medium', category: 'Technical', roles: ['frontend', 'fullstack'], tags: ['api'] },
  { id: 24, text: "Explain how 'CSS Modules' or 'Styled Components' help in managing large-scale styling.", difficulty: 'Medium', category: 'Technical', roles: ['frontend'], tags: ['css'] },

  { id: 30, text: "Describe the 'Reconciliation' process in React. How does the 'key' prop assist in this?", difficulty: 'Hard', category: 'Technical', roles: ['frontend'], tags: ['react'] },
  { id: 31, text: "What is 'Micro-Frontend' architecture, and what are the pros and cons of using it?", difficulty: 'Hard', category: 'Technical', roles: ['frontend'], tags: ['architecture'] },
  { id: 32, text: "Explain the concept of 'Web Workers' and how they can be used to improve frontend performance.", difficulty: 'Hard', category: 'Technical', roles: ['frontend'], tags: ['javascript'] },

  { id: 40, text: "What are the common HTTP status codes (200, 404, 500) and what do they mean?", difficulty: 'Easy', category: 'Technical', roles: ['backend', 'fullstack'], tags: ['api'] },
  { id: 41, text: "What is the difference between a 'DELETE' and a 'TRUNCATE' command in SQL?", difficulty: 'Easy', category: 'Technical', roles: ['backend', 'data scientist'], tags: ['sql'] },
  { id: 42, text: "Explain what an 'Environment Variable' is and why we use them in backend development.", difficulty: 'Easy', category: 'Technical', roles: ['backend', 'devops'], tags: ['general'] },

  { id: 50, text: "What is a 'Database Migration', and why is it important in a team development environment?", difficulty: 'Medium', category: 'Technical', roles: ['backend', 'fullstack'], tags: ['database'] },
  { id: 51, text: "Explain the concept of 'Dependency Injection' and how it helps in writing testable code.", difficulty: 'Medium', category: 'Technical', roles: ['backend'], tags: ['architecture'] },
  { id: 52, text: "What is a 'Race Condition' in multi-threaded applications, and how can you prevent it?", difficulty: 'Medium', category: 'Technical', roles: ['backend'], tags: ['concurrency'] },
  { id: 53, text: "How do you implement 'Pagination' effectively in a REST API to handle large datasets?", difficulty: 'Medium', category: 'Technical', roles: ['backend', 'fullstack'], tags: ['api'] },

  { id: 60, text: "What is 'Idempotency' in the context of APIs, and why is it crucial for reliable systems?", difficulty: 'Hard', category: 'Technical', roles: ['backend', 'fullstack'], tags: ['api'] },
  { id: 61, text: "Describe the 'Circuit Breaker' pattern and how it improves the resilience of microservices.", difficulty: 'Hard', category: 'Technical', roles: ['backend'], tags: ['microservices'] },
  { id: 62, text: "How do you design a database schema for a real-time chat application with millions of users?", difficulty: 'Hard', category: 'Technical', roles: ['backend'], tags: ['system design'] },

  { id: 70, text: "What is the difference between 'Categorical' and 'Numerical' data?", difficulty: 'Easy', category: 'Technical', roles: ['data scientist'], tags: ['statistics'] },
  { id: 71, text: "In Python, how do you handle exceptions using try-except blocks?", difficulty: 'Easy', category: 'Technical', roles: ['data scientist', 'backend'], tags: ['python'] },

  { id: 80, text: "What is 'Normalization' vs 'Standardization', and when would you use one over the other?", difficulty: 'Medium', category: 'Technical', roles: ['data scientist'], tags: ['data cleaning'] },
  { id: 81, text: "Explain the difference between 'Random Forest' and 'Gradient Boosting'.", difficulty: 'Medium', category: 'Technical', roles: ['data scientist'], tags: ['machine learning'] },
  { id: 82, text: "How do you use 'Window Functions' in SQL to perform complex calculations across rows?", difficulty: 'Medium', category: 'Technical', roles: ['data scientist', 'sql'], tags: ['sql'] },

  { id: 90, text: "What is the 'Vanishing Gradient' problem in deep learning, and how do we mitigate it?", difficulty: 'Hard', category: 'Technical', roles: ['data scientist'], tags: ['deep learning'] },
  { id: 91, text: "Explain the concept of 'Precision-Recall Tradeoff' and how to choose the right metric for your model.", difficulty: 'Hard', category: 'Technical', roles: ['data scientist'], tags: ['machine learning'] },

  { id: 100, text: "What is the 'Final' keyword in Java when applied to variables, methods, and classes?", difficulty: 'Easy', category: 'Technical', roles: ['java developer', 'backend'], tags: ['java'] },
  { id: 101, text: "Explain the difference between 'ArrayList' and 'LinkedList' in terms of performance.", difficulty: 'Medium', category: 'Technical', roles: ['java developer', 'backend'], tags: ['java'] },
  { id: 102, text: "What are 'Java Streams', and how do they help in writing cleaner code?", difficulty: 'Medium', category: 'Technical', roles: ['java developer'], tags: ['java'] },

  { id: 110, text: "What is a 'Container Registry', and how is it used in a CI/CD pipeline?", difficulty: 'Easy', category: 'Technical', roles: ['devops'], tags: ['docker'] },
  { id: 111, text: "Explain the concept of 'Immutable Infrastructure'.", difficulty: 'Medium', category: 'Technical', roles: ['devops'], tags: ['cloud'] },
  { id: 112, text: "How does 'Prometheus' work for monitoring, and what are 'Alertmanager' rules?", difficulty: 'Hard', category: 'Technical', roles: ['devops'], tags: ['monitoring'] },
];

function buildQuestionSet(userRole: string, experience: string, skills: string[], hasResume: boolean): Question[] {
  const normalizedRole = userRole.toLowerCase();
  const normalizedSkills = skills.map(s => s.toLowerCase().trim());
  const exp = experience.toLowerCase();

  const targetDiff = exp.includes('junior') || exp.includes('fresher') ? 'Easy' :
    exp.includes('mid') ? 'Medium' : 'Hard';

  const introQ = QUESTION_BANK.find(q => q.id === 1)!;
  const processedIntro = { ...introQ, text: introQ.text.replace('${ROLE}', userRole) };

  const otherBehavioral = QUESTION_BANK.filter(q => q.category === 'Behavioral' && q.id !== 1)
    .sort(() => Math.random() - 0.5)
    .slice(0, 1)
    .map(q => ({ ...q, text: q.text.replace('${ROLE}', userRole) }));

  let skillMatched = QUESTION_BANK.filter(q =>
    q.category === 'Technical' &&
    q.tags.some(tag => normalizedSkills.includes(tag))
  );

  if (skillMatched.length < 5) {
    skillMatched = QUESTION_BANK.filter(q =>
      q.category === 'Technical' &&
      (q.roles.some(r => normalizedRole.includes(r) || r === 'any'))
    );
  }

  let matched = skillMatched.filter(q => q.difficulty === targetDiff);
  if (matched.length < 10) {
    matched = skillMatched.filter(q => {
      if (targetDiff === 'Easy') return q.difficulty === 'Easy' || q.difficulty === 'Medium';
      if (targetDiff === 'Medium') return q.difficulty === 'Medium' || q.difficulty === 'Easy' || q.difficulty === 'Hard';
      return q.difficulty === 'Hard' || q.difficulty === 'Medium';
    });
  }

  let selectedTechnical = matched.sort(() => Math.random() - 0.5).slice(0, 10);

  const others = [...otherBehavioral, ...selectedTechnical].sort(() => Math.random() - 0.5);
  const finalSet = [processedIntro, ...others];

  return finalSet.slice(0, 12).map((q, i) => ({ ...q, id: i + 1 }));
}

type AvatarState = 'idle' | 'thinking' | 'speaking';

export default function InterviewScreen({ candidateName, role, experience, skills, resumeName, onEnd }: InterviewScreenProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [currentQ, setCurrentQ] = useState(0);
  const [answered, setAnswered] = useState<number[]>([]);
  const [skipped, setSkipped] = useState<number[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>('thinking');
  const [displayedQuestion, setDisplayedQuestion] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [showEndModal, setShowEndModal] = useState(false);
  const [confidence, setConfidence] = useState(72);
  const [attention, setAttention] = useState<'Focused' | 'Distracted'>('Focused');
  const [answerTime, setAnswerTime] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef(Date.now());
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [totalQualityPoints, setTotalQualityPoints] = useState(0);

  const { showWarning, warningCount, dismissWarning } = useTabWarning(true);
  const timer = useTimer(120);
  const timerColor = timer.urgency === 'red' ? 'var(--accent-red)' : timer.urgency === 'amber' ? 'var(--accent-amber)' : 'var(--accent-green)';

  useEffect(() => {
    setQuestions(buildQuestionSet(role, experience, skills, !!resumeName));
    setIsMounted(true);
  }, [role, experience, skills, resumeName]);

  const question = questions[currentQ];

  useEffect(() => {
    if (!isMounted) return;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } });
        cameraStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch { }
    };
    startCamera();
    return () => {
      cameraStreamRef.current?.getTracks().forEach(t => t.stop());
      window.speechSynthesis?.cancel();
    };
  }, [isMounted]);

  const speakText = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.98;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Google US English') || v.name.includes('Microsoft Aria')) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (preferred) utter.voice = preferred;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => { setSpeaking(false); setAvatarState('idle'); timer.reset(120); timer.start(); };
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    if (!isMounted || questions.length === 0 || !question) return;

    setDisplayedQuestion('');
    setAvatarState('thinking');
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    const thinkDelay = setTimeout(() => {
      setAvatarState('speaking');
      let i = 0;
      const text = question.text;
      speakText(text);
      typingIntervalRef.current = setInterval(() => {
        i++;
        setDisplayedQuestion(text.slice(0, i));
        if (i >= text.length && typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      }, 25);
    }, 1200);
    return () => { clearTimeout(thinkDelay); if (typingIntervalRef.current) clearInterval(typingIntervalRef.current); };
  }, [currentQ, isMounted, questions, question]);

  useEffect(() => {
    const interval = setInterval(() => {
      setConfidence(c => Math.min(99, Math.max(40, c + (Math.random() - 0.4) * 5)));
      setAttention(Math.random() < 0.1 ? 'Distracted' : 'Focused');
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnswering) interval = setInterval(() => setAnswerTime(t => t + 1), 1000);
    else setAnswerTime(0);
    return () => clearInterval(interval);
  }, [isAnswering]);

  const startAnswer = () => { window.speechSynthesis?.cancel(); setSpeaking(false); setIsAnswering(true); timer.pause(); };
  const submitAnswer = () => {
    if (!question) return;
    setIsAnswering(false);
    setAnswered(a => [...a, question.id]);
    let points = answerTime > 20 ? 10 : answerTime > 8 ? 5 : 0;
    setTotalQualityPoints(prev => prev + points);
    setTranscript(t => [...t, `Q${currentQ + 1}: Response recorded.`]);
    goNext();
  };

  const skipQuestion = () => {
    if (skipped.length >= 2 || !question) return;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setIsAnswering(false);
    setSkipped(s => [...s, question.id]);
    setTotalQualityPoints(prev => prev - 2);
    goNext();
  };

  const goNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ(q => q + 1);
    else endInterview();
  };

  const endInterview = () => {
    window.speechSynthesis?.cancel();
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const finalScore = Math.max(0, Math.min(100, totalQualityPoints * 0.95));
    onEnd({ questionsAttempted: answered.length, totalQuestions: questions.length, timeTaken, performanceScore: finalScore, codingScore: 0, transcript });
  };

  const progress = questions.length > 0 ? (currentQ / questions.length) * 100 : 0;
  const difficultyColor = question ? { Easy: 'badge-green', Medium: 'badge-amber', Hard: 'badge-red' }[question.difficulty] : 'badge-ghost';

  if (!isMounted || questions.length === 0 || !question) {
    return (
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Preparing your interview environment...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {showWarning && (
        <div className={styles.warningOverlay}>
          <div className={styles.warningModal}>
            <AlertTriangle size={32} className={styles.warningIcon} />
            <h2 className={styles.warningTitle}>Tab Switch Detected!</h2>
            <p className={styles.warningDesc}>Please stay focused on the interview window.</p>
            <button className="btn btn-primary" onClick={dismissWarning}>Resume Interview</button>
          </div>
        </div>
      )}

      {showEndModal && (
        <div className={styles.warningOverlay}>
          <div className={styles.warningModal}>
            <StopCircle size={32} style={{ color: 'var(--accent-red)' }} />
            <h2 className={styles.warningTitle}>End Early?</h2>
            <p className={styles.warningDesc}>You still have questions remaining. End anyway?</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setShowEndModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={endInterview}>End Now</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.headerWrapper}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}><Brain size={18} /></div>
            <span className={styles.logoText}>InterviewAI</span>
            <span className={styles.sessionBadge}>LIVE</span>
          </div>

          <div className={styles.headerCenter}>
            <div className={styles.progressInfo}>
              <span className={styles.progressLabel}>Question {currentQ + 1} of {questions.length}</span>
              <div className="progress-track" style={{ width: '200px' }}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className={styles.headerRight}>
            <button className={styles.voiceToggle} onClick={() => setVoiceEnabled(!voiceEnabled)}>
              {!voiceEnabled ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {!voiceEnabled ? 'Muted' : 'Voice On'}
            </button>
            <div className={styles.timerBadge} style={{ color: timerColor, borderColor: timerColor }}>
              <Clock size={13} />
              {timer.format()}
            </div>
            <ThemeToggle />
          </div>
        </header>
      </div>

      <div className={styles.layoutWrapper}>
        <div className={styles.layout}>
          <div className={styles.aiPanel}>
            <div className={styles.aiPanelInner}>
              <AIAvatar state={speaking ? 'speaking' : avatarState} size="lg" />
              {speaking && (
                <div className={styles.speakingIndicator}>
                  <Waveform active={true} color="cyan" bars={14} />
                  <span>AI Interviewer is speaking...</span>
                </div>
              )}
              <div className={styles.questionCard}>
                <div className={styles.questionMeta}>
                  <span className={`badge ${difficultyColor}`}>{question.difficulty}</span>
                  <span className="badge badge-primary">{role}</span>
                </div>
                <p className={styles.questionText}>{displayedQuestion}<span className={styles.cursor} /></p>
              </div>

              <div className={styles.skillInfo}>
                <span className={styles.skillInfoLabel}>Assessing Skills:</span>
                {skills.slice(0, 5).map(s => (
                  <span key={s} className="badge badge-ghost" style={{ fontSize: '0.65rem' }}>{s}</span>
                ))}
                {skills.length > 5 && <span className={styles.skillInfoMore}>+{skills.length - 5} more</span>}
              </div>
            </div>
          </div>

          <div className={styles.candidatePanel}>
            <div className={styles.videoCard}>
              <div className={styles.videoFeed}>
                <video ref={videoRef} className={styles.realVideo} autoPlay muted playsInline />
                <div className={styles.cameraOverlay}>
                  <div className={styles.videoCorner} />
                  <div className={`${styles.videoCorner} ${styles.tr}`} />
                  <div className={`${styles.videoCorner} ${styles.bl}`} />
                  <div className={`${styles.videoCorner} ${styles.br}`} />
                </div>
              </div>
              <div className={styles.videoFooter}>
                <div className={styles.videoInfo}>{candidateName} (Live)</div>
              </div>
            </div>

            <div className={styles.metricsRow}>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Confidence</span>
                <span className={styles.attentionValue}>{Math.round(confidence)}%</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Focus</span>
                <span className={styles.attentionValue}>{attention}</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Skips</span>
                <span className={styles.skipsValue}>{2 - skipped.length}</span>
              </div>
            </div>

            <div className={styles.waveCard}>
              <Waveform active={isAnswering} color="cyan" bars={24} />
              {isAnswering && <span className={styles.recTimer}>{answerTime}s</span>}
            </div>

            <div className={styles.actions}>
              {!isAnswering ? (
                <button className={`btn btn-primary ${styles.answerBtn}`} onClick={startAnswer} disabled={speaking}>
                  <Mic size={18} />
                  <span>Click to Answer</span>
                </button>
              ) : (
                <button className={`btn btn-success ${styles.answerBtn}`} onClick={submitAnswer}>
                  <Send size={18} />
                  <span>Submit Answer</span>
                </button>
              )}

              <div className={styles.secondaryActions}>
                <button className="btn btn-secondary" onClick={skipQuestion} disabled={isAnswering || skipped.length >= 2}>
                  <SkipForward size={14} />
                  Skip
                </button>
                <button className="btn btn-danger" onClick={() => setShowEndModal(true)}>
                  <StopCircle size={14} />
                  End Early
                </button>
              </div>
            </div>

            <div className={styles.transcriptSection}>
              <button className={styles.transcriptToggle} onClick={() => setShowTranscript(!showTranscript)}>
                <MessageSquare size={14} />
                {showTranscript ? 'Hide' : 'Show'} Transcript
              </button>
              {showTranscript && (
                <div className={styles.transcriptPanel}>
                  {transcript.length === 0 ? (
                    <p className={styles.transcriptEmpty}>No responses recorded yet.</p>
                  ) : (
                    transcript.map((t, idx) => (
                      <div key={idx} className={styles.transcriptEntry}>
                        <div className={styles.transcriptQ}>{idx + 1}</div>
                        <p>{t}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
