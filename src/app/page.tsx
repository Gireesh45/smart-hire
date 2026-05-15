'use client';
import { useState, useEffect } from 'react';
import LandingScreen from '@/components/screens/LandingScreen';
import CandidateDetailsScreen from '@/components/screens/CandidateDetailsScreen';
import InterviewSetupScreen from '@/components/screens/InterviewSetupScreen';
import InterviewScreen from '@/components/screens/InterviewScreen';
import CodingScreen from '@/components/screens/CodingScreen';
import SummaryScreen from '@/components/screens/SummaryScreen';

type Screen = 'landing' | 'details' | 'setup' | 'interview' | 'coding' | 'summary';

interface CandidateData {
  fullName: string;
  email: string;
  role: string;
  experience: string;
  skills: string[];
  resumeName: string;
}

interface InterviewResult {
  questionsAttempted: number;
  totalQuestions: number;
  timeTaken: number;
  performanceScore: number;
  codingScore: number;
  transcript: string[];
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [transitioning, setTransitioning] = useState(false);
  const [candidate, setCandidate] = useState<CandidateData>({
    fullName: '', email: '', role: '', experience: '', skills: [], resumeName: '',
  });
  const [result, setResult] = useState<InterviewResult>({
    questionsAttempted: 0, totalQuestions: 10, timeTaken: 0, performanceScore: 0, codingScore: 0, transcript: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem('interview-ai-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const navigate = (to: Screen) => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(to);
      setTransitioning(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  const screenClass = transitioning ? 'screen-exit' : 'screen-enter';

  return (
    <div className={screenClass}>
      {screen === 'landing' && (
        <LandingScreen onStart={() => navigate('details')} />
      )}
      {screen === 'details' && (
        <CandidateDetailsScreen
          onBack={() => navigate('landing')}
          onNext={(data) => { setCandidate(data); navigate('setup'); }}
        />
      )}
      {screen === 'setup' && (
        <InterviewSetupScreen
          candidateName={candidate.fullName}
          onBack={() => navigate('details')}
          onStart={() => navigate('interview')}
        />
      )}
      {screen === 'interview' && (
        <InterviewScreen
          candidateName={candidate.fullName}
          role={candidate.role}
          experience={candidate.experience}
          skills={candidate.skills}
          resumeName={candidate.resumeName}
          onEnd={(res) => {
            setResult(res);
            navigate('coding');
          }}
        />
      )}
      {screen === 'coding' && (
        <CodingScreen
          questionNumber={1}
          totalQuestions={1}
          role={candidate.role}
          onNext={(score) => { 
            setResult(prev => ({ ...prev, codingScore: score }));
            navigate('summary'); 
          }}
        />
      )}
      {screen === 'summary' && (
        <SummaryScreen
          candidateName={candidate.fullName}
          role={candidate.role}
          questionsAttempted={result.questionsAttempted}
          totalQuestions={result.totalQuestions}
          timeTaken={result.timeTaken}
          performanceScore={result.performanceScore}
          codingScore={result.codingScore}
          onRestart={() => {
            localStorage.removeItem('interview-ai-candidate');
            setCandidate({ fullName: '', email: '', role: '', experience: '', skills: [], resumeName: '' });
            setResult({ questionsAttempted: 0, totalQuestions: 10, timeTaken: 0, performanceScore: 0, codingScore: 0, transcript: [] });
            navigate('landing');
          }}
        />
      )}
    </div>
  );
}
