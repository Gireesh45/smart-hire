'use client';
import { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Wifi, ChevronRight, ArrowLeft, Brain, CheckCircle, XCircle, AlertCircle, RefreshCw, Volume2 } from 'lucide-react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import styles from './InterviewSetupScreen.module.css';

interface InterviewSetupScreenProps {
  onBack: () => void;
  onStart: () => void;
  candidateName: string;
}

type CheckStatus = 'checking' | 'pass' | 'fail' | 'idle';

export default function InterviewSetupScreen({ onBack, onStart, candidateName }: InterviewSetupScreenProps) {
  const [cameraStatus, setCameraStatus] = useState<CheckStatus>('idle');
  const [micStatus, setMicStatus] = useState<CheckStatus>('idle');
  const [netStatus, setNetStatus] = useState<CheckStatus>('checking');
  const [allPassed, setAllPassed] = useState(false);
  const [micLevel, setMicLevel] = useState<number[]>(Array(28).fill(4));
  const [cameraError, setCameraError] = useState('');
  const [micError, setMicError] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const micStreamRef = useRef<MediaStream | null>(null);

  const [netStats, setNetStats] = useState({ latency: 0, speed: 0, quality: 'Stable' });

  useEffect(() => {
    const checkNetwork = async () => {
      if (!navigator.onLine) {
        setNetStatus('fail');
        return;
      }

      try {
        const start = Date.now();
        await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-cache' });
        const latency = Date.now() - start;

        const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        const speed = conn ? conn.downlink : 0;
        const quality = latency < 100 ? 'Stable' : latency < 300 ? 'Fair' : 'Unstable';

        setNetStats({ latency, speed, quality });
        setNetStatus('pass');
      } catch (err) {
        setNetStatus(navigator.onLine ? 'pass' : 'fail');
      }
    };
    checkNetwork();
  }, []);

  useEffect(() => {
    setAllPassed(cameraStatus === 'pass' && micStatus === 'pass' && netStatus === 'pass');
  }, [cameraStatus, micStatus, netStatus]);

  useEffect(() => {
    return () => {
      cameraStreamRef.current?.getTracks().forEach(t => t.stop());
      micStreamRef.current?.getTracks().forEach(t => t.stop());
      audioContextRef.current?.close();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const checkCamera = async () => {
    setCameraStatus('checking');
    setCameraError('');
    cameraStreamRef.current?.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360, facingMode: 'user' } });
      cameraStreamRef.current = stream;
      setCameraStatus('pass');
    } catch (err: any) {
      setCameraStatus('fail');
      setCameraError(err.name === 'NotAllowedError' ? 'Camera permission denied. Please allow camera access.' : 'No camera found or it is in use.');
    }
  };

  useEffect(() => {
    if (cameraStatus === 'pass' && cameraStreamRef.current && videoRef.current) {
      videoRef.current.srcObject = cameraStreamRef.current;
      videoRef.current.play().catch(console.error);
    }
  }, [cameraStatus]);

  const checkMic = async () => {
    setMicStatus('checking');
    setMicError('');
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    audioContextRef.current?.close();
    cancelAnimationFrame(animFrameRef.current);
    setMicLevel(Array(28).fill(4));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const draw = () => {
        analyser.getByteFrequencyData(dataArray);
        const bars = Array(28).fill(0).map((_, i) => {
          const idx = Math.floor((i / 28) * dataArray.length);
          return Math.max(4, (dataArray[idx] / 255) * 38);
        });
        setMicLevel(bars);
        animFrameRef.current = requestAnimationFrame(draw);
      };
      draw();
      setMicStatus('pass');
    } catch (err: any) {
      setMicStatus('fail');
      setMicError(err.name === 'NotAllowedError' ? 'Microphone permission denied. Please allow mic access.' : 'No microphone found.');
    }
  };

  const guidelines = [
    'Ensure your face is clearly visible throughout the interview',
    'Speak clearly and at a moderate pace when answering',
    'Do not leave or switch the browser tab during the interview',
    'Answer all questions truthfully and to the best of your ability',
    'For coding questions, explain your thought process as you code',
    'You may skip a maximum of 2 questions during the interview',
    'The AI evaluates both content quality and communication clarity',
  ];

  const StatusIcon = ({ status }: { status: CheckStatus }) => {
    if (status === 'checking') return <RefreshCw size={16} className={styles.spinning} />;
    if (status === 'pass') return <CheckCircle size={16} className={styles.iconPass} />;
    if (status === 'fail') return <XCircle size={16} className={styles.iconFail} />;
    return <AlertCircle size={16} className={styles.iconIdle} />;
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg}><div className={styles.bgOrb} /></div>

      <header className={styles.header}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}><Brain size={18} /></div>
            <span>Interview<span className="text-gradient">AI</span></span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.wrapper}>
          <div className={styles.stepIndicator}>
            {['Details', 'Setup', 'Interview'].map((s, i) => (
              <div key={i} className={`${styles.step} ${i === 1 ? styles.stepActive : i === 0 ? styles.stepDone : styles.stepPending}`}>
                <div className={styles.stepDot}>{i === 0 ? <CheckCircle size={14} /> : i + 1}</div>
                <span>{s}</span>
                {i < 2 && <div className={styles.stepLine} />}
              </div>
            ))}
          </div>

          <div className={styles.content}>
            <div className={styles.left}>
              <h1 className={styles.title}>System Check</h1>
              <p className={styles.desc}>Hi <strong>{candidateName || 'there'}</strong>! Let's make sure everything is set up before your interview begins.</p>

              <div className={styles.checkCard}>
                <div className={styles.checkHeader}>
                  <div className={styles.checkInfo}>
                    <div className={`${styles.checkIcon} ${cameraStatus === 'pass' ? styles.checkIconPass : cameraStatus === 'fail' ? styles.checkIconFail : ''}`}>
                      <Camera size={18} />
                    </div>
                    <div>
                      <h3 className={styles.checkTitle}>Camera</h3>
                      <p className={styles.checkSubtitle}>
                        {cameraStatus === 'idle' ? 'Not checked yet' : cameraStatus === 'checking' ? 'Requesting camera access...' : cameraStatus === 'pass' ? 'Camera is working ✓' : (cameraError || 'Camera not found')}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <StatusIcon status={cameraStatus} />
                    <button className="btn btn-secondary btn-sm" onClick={checkCamera} disabled={cameraStatus === 'checking'}>
                      {cameraStatus === 'idle' ? 'Test Camera' : 'Retest'}
                    </button>
                  </div>
                </div>

                <div className={`${styles.cameraPreview} ${cameraStatus === 'pass' ? styles.cameraActive : ''}`}>
                  {cameraStatus === 'pass' ? (
                    <div className={styles.cameraFeed}>
                      <video
                        ref={videoRef}
                        className={styles.realVideo}
                        autoPlay
                        muted
                        playsInline
                      />
                      <div className={styles.cameraOverlay}>
                        <div className={styles.cameraCorner} />
                        <div className={`${styles.cameraCorner} ${styles.cameraCornerTR}`} />
                        <div className={`${styles.cameraCorner} ${styles.cameraCornerBL}`} />
                        <div className={`${styles.cameraCorner} ${styles.cameraCornerBR}`} />
                      </div>
                      <div className={styles.cameraLabel}>
                        <span className="status-dot online" />
                        Live Preview
                      </div>
                    </div>
                  ) : cameraStatus === 'fail' ? (
                    <div className={styles.cameraOff}>
                      <XCircle size={28} style={{ color: 'var(--accent-red)', opacity: 0.6 }} />
                      <span>{cameraError || 'Camera unavailable'}</span>
                    </div>
                  ) : (
                    <div className={styles.cameraOff}>
                      <Camera size={32} className={styles.cameraOffIcon} />
                      <span>Click &quot;Test Camera&quot; to enable real preview</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.checkCard}>
                <div className={styles.checkHeader}>
                  <div className={styles.checkInfo}>
                    <div className={`${styles.checkIcon} ${micStatus === 'pass' ? styles.checkIconPass : micStatus === 'fail' ? styles.checkIconFail : ''}`}>
                      <Mic size={18} />
                    </div>
                    <div>
                      <h3 className={styles.checkTitle}>Microphone</h3>
                      <p className={styles.checkSubtitle}>
                        {micStatus === 'idle' ? 'Not checked yet' : micStatus === 'checking' ? 'Requesting mic access...' : micStatus === 'pass' ? 'Mic is working ✓ — speak to see live levels' : (micError || 'Microphone not found')}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <StatusIcon status={micStatus} />
                    <button className="btn btn-secondary btn-sm" onClick={checkMic} disabled={micStatus === 'checking'}>
                      {micStatus === 'idle' ? 'Test Mic' : 'Retest'}
                    </button>
                  </div>
                </div>
                <div className={styles.micWave}>
                  <div className={styles.realWaveform}>
                    {micLevel.map((h, i) => (
                      <div
                        key={i}
                        className={`${styles.waveBar} ${micStatus === 'pass' ? styles.waveBarActive : ''}`}
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                  <span className={styles.micWaveLabel}>
                    {micStatus === 'pass' ? '● Live' : 'Microphone inactive'}
                  </span>
                </div>
              </div>

              <div className={styles.checkCard}>
                <div className={styles.checkHeader}>
                  <div className={styles.checkInfo}>
                    <div className={`${styles.checkIcon} ${netStatus === 'pass' ? styles.checkIconPass : ''}`}>
                      <Wifi size={18} />
                    </div>
                    <div>
                      <h3 className={styles.checkTitle}>Internet Connection</h3>
                      <p className={styles.checkSubtitle}>
                        {netStatus === 'checking' ? 'Measuring connection...' : netStatus === 'pass' ? 'Good connection detected' : 'No connection detected'}
                      </p>
                    </div>
                  </div>
                  <StatusIcon status={netStatus} />
                </div>
                {netStatus === 'pass' && (
                  <div className={styles.netStats}>
                    <div className={styles.netStat}><span className={styles.netVal}>{netStats.latency} ms</span><span className={styles.netLbl}>Latency</span></div>
                    <div className={styles.netStat}><span className={styles.netVal}>{netStats.speed || '> 10'} Mbps</span><span className={styles.netLbl}>Download</span></div>
                    <div className={styles.netStat}><span className={styles.netVal}>{netStats.quality}</span><span className={styles.netLbl}>Quality</span></div>
                  </div>
                )}
              </div>

              <div className={styles.ttsNote}>
                <Volume2 size={14} />
                <span>The AI interviewer will speak questions aloud using your browser&apos;s text-to-speech. Ensure your volume is turned on.</span>
              </div>

              <div className={styles.actions}>
                <button className="btn btn-ghost" onClick={onBack}>
                  <ArrowLeft size={16} />Back
                </button>
                <button
                  id="begin-interview-btn"
                  className="btn btn-primary"
                  onClick={onStart}
                  disabled={!allPassed}
                >
                  Begin Interview
                  <ChevronRight size={16} />
                </button>
              </div>
              {!allPassed && (
                <p className={styles.checkHint}>Complete all system checks to continue</p>
              )}
            </div>

            <div className={styles.right}>
              <div className={styles.guidelinesCard}>
                <h2 className={styles.guidelinesTitle}>
                  <AlertCircle size={16} style={{ color: 'var(--accent-amber)' }} />
                  Interview Guidelines
                </h2>
                <div className={styles.guidelinesList}>
                  {guidelines.map((g, i) => (
                    <div key={i} className={styles.guideline}>
                      <div className={styles.guidelineNum}>{i + 1}</div>
                      <p>{g}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
