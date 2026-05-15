'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Code, Play, Send, SkipForward, Clock, Brain, AlertCircle, CheckCircle, ChevronDown, Terminal } from 'lucide-react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { useTimer } from '@/hooks/useTimer';
import styles from './CodingScreen.module.css';

interface CodingScreenProps {
  onNext: (score: number) => void;
  questionNumber: number;
  totalQuestions: number;
  role: string;
}

interface Challenge {
  title: string;
  description: string;
  starter: string;
  exampleInput: string;
  exampleOutput: string;
  constraints: string[];
  notes: string;
  validation: (code: string) => { passed: boolean; reason: string };
}

const CODING_CHALLENGES: Record<string, Challenge> = {
  frontend: {
    title: "Array.map Polyfill",
    description: "In React and modern JavaScript development, custom data transformation is a core skill. Your task is to implement a manual version of the 'Array.map' method.\n\nThe function should create a new array populated with the results of calling a provided callback function on every element in the input array.",
    starter: "function myMap(arr, callback) {\n    const result = [];\n    \n    return result;\n}",
    exampleInput: "[1, 2, 3], x => x * 2",
    exampleOutput: "[2, 4, 6]",
    constraints: ["Time Complexity: O(n)", "Space Complexity: O(n) (for the new array)", "Do not use the built-in Array.prototype.map()"],
    notes: "Remember that the original array should remain unmodified (immutability).",
    validation: (code) => {
      try {
        const testScript = code + "\nreturn typeof myMap === 'function' ? myMap([1, 2, 3], x => x * 2) : [];";
        const result = new Function(testScript)();
        if (Array.isArray(result) && result.length === 3 && result[0] === 2 && result[1] === 4 && result[2] === 6) {
          return { passed: true, reason: "" };
        }
        return { passed: false, reason: "Output did not match expected [2, 4, 6]." };
      } catch (e) {
        return { passed: false, reason: e instanceof Error ? e.message : "Syntax Error or Execution Error." };
      }
    }
  },
  backend: {
    title: "Two Sum Problem",
    description: "Given an array of integers 'nums' and an integer 'target', return the indices of the two numbers such that they add up to the target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    starter: "function twoSum(nums, target) {\n    \n}",
    exampleInput: "nums = [2, 7, 11, 15], target = 9",
    exampleOutput: "[0, 1]",
    constraints: ["Time Complexity: O(n)", "Space Complexity: O(n)", "Ensure you return the indices, not the values."],
    notes: "Think about using a Hash Map for optimal O(1) lookups instead of nested loops.",
    validation: (code) => {
      try {
        const testScript = code + "\nreturn typeof twoSum === 'function' ? twoSum([2, 7, 11, 15], 9) : [];";
        const result = new Function(testScript)();
        if (Array.isArray(result) && result.length === 2 && result.includes(0) && result.includes(1)) {
          return { passed: true, reason: "" };
        }
        return { passed: false, reason: "Output did not match expected [0, 1]." };
      } catch (e) {
        return { passed: false, reason: e instanceof Error ? e.message : "Syntax Error or Execution Error." };
      }
    }
  },
  data: {
    title: "Calculate Average",
    description: "Data analysis often begins with basic statistics. Implement a function to calculate the mean (average) of an array of numbers.\n\nEfficiency is key, and you must handle edge cases like empty datasets or non-numerical values gracefully.",
    starter: "function calculateMean(data) {\n    if (!Array.isArray(data) || data.length === 0) return 0;\n    \n}",
    exampleInput: "[10, 20, 30, 40]",
    exampleOutput: "25",
    constraints: ["Time Complexity: O(n)", "Space Complexity: O(1)", "Handle empty arrays gracefully."],
    notes: "Consider precision if your environment requires strictly formatted floating-point results.",
    validation: (code) => {
      try {
        const testScript = code + "\nreturn typeof calculateMean === 'function' ? calculateMean([10, 20, 30, 40]) : null;";
        const result = new Function(testScript)();
        if (result === 25) {
          return { passed: true, reason: "" };
        }
        return { passed: false, reason: "Output did not match expected 25." };
      } catch (e) {
        return { passed: false, reason: e instanceof Error ? e.message : "Syntax Error or Execution Error." };
      }
    }
  },
  devops: {
    title: "Log Processing Engine",
    description: "In high-scale infrastructure, parsing logs is a daily task. Implement a function that takes an array of log strings and a filter level (e.g., 'ERROR').\n\nYour task is to return a new array containing only the logs that include that specific level.",
    starter: "function filterLogs(logs, level) {\n    \n}",
    exampleInput: "logs = ['INFO: start', 'ERROR: db fail'], level = 'ERROR'",
    exampleOutput: "['ERROR: db fail']",
    constraints: ["Time Complexity: O(n * m) where m is string length", "Space Complexity: O(n) (for filtered output)", "Do not mutate the original log array."],
    notes: "Using standard array filtering methods combined with string matching is the cleanest approach.",
    validation: (code) => {
      try {
        const testScript = code + "\nreturn typeof filterLogs === 'function' ? filterLogs(['INFO: start', 'ERROR: db fail'], 'ERROR') : [];";
        const result = new Function(testScript)();
        if (Array.isArray(result) && result.length === 1 && result[0] === 'ERROR: db fail') {
          return { passed: true, reason: "" };
        }
        return { passed: false, reason: "Output did not match expected ['ERROR: db fail']." };
      } catch (e) {
        return { passed: false, reason: e instanceof Error ? e.message : "Syntax Error or Execution Error." };
      }
    }
  }
};

export default function CodingScreen({ onNext, questionNumber, totalQuestions, role }: CodingScreenProps) {
  const normalizedRole = role.toLowerCase();
  const challenge = useMemo(() => {
    if (normalizedRole.includes('frontend')) return CODING_CHALLENGES.frontend;
    if (normalizedRole.includes('data')) return CODING_CHALLENGES.data;
    if (normalizedRole.includes('devops')) return CODING_CHALLENGES.devops;
    return CODING_CHALLENGES.backend;
  }, [normalizedRole]);

  const [code, setCode] = useState(challenge.starter);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>("Ready to run...");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const timer = useTimer(900);
  const lineCount = code.split('\n').length;

  const handleRun = () => {
    setIsRunning(true);
    setOutput("Validating code structure...");
    setTimeout(() => {
      const val = challenge.validation(code);
      setIsRunning(false);
      setOutput(val.passed ? "✓ Validation Passed: Code structure is correct." : `✗ Error: ${val.reason}`);
    }, 1000);
  };

  const submitCode = () => {
    setShowConfirm(false);
    setIsSuccess(true);
    const val = challenge.validation(code);
    setTimeout(() => onNext(val.passed ? 100 : 20), 1800);
  };

  const timerColor = timer.urgency === 'red' ? 'var(--accent-red)' : timer.urgency === 'amber' ? 'var(--accent-amber)' : 'var(--accent-green)';

  return (
    <div className={styles.page}>
      {(showConfirm || isSuccess) && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            {isSuccess ? (
              <>
                <div className={styles.successIcon}>🚀</div>
                <h2>Solution Submitted</h2>
                <p>Analyzing your technical performance... One moment.</p>
                <div className={styles.spinner} />
              </>
            ) : (
              <>
                <Send size={32} color="var(--accent-primary)" />
                <h2>Submit Code?</h2>
                <p>Are you sure you want to finalize this solution for your {role} round?</p>
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={submitCode}>Yes, Submit</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className={styles.headerWrapper}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}><Code size={18} /></div>
            <span className={styles.logoText}>CodeEditor</span>
            <span className={styles.codingBadge}>EVALUATION</span>
          </div>
          <div className={styles.headerCenter}>
            <span className={styles.qLabel}>Challenge {questionNumber} of {totalQuestions}</span>
          </div>
          <div className={styles.headerRight}>
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
          <aside className={styles.problemPanel}>
            <div className={styles.problemHeader}>
              <h1 className={styles.problemTitle}>{challenge.title}</h1>
              <p className={styles.problemDesc}>{challenge.description}</p>
            </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Examples</h3>
            <div className={styles.exampleBlock}>
              <div className={styles.exampleRow}>
                <span className={styles.exLabel}>Input:</span>
                <span className={styles.exCode}>{challenge.exampleInput}</span>
              </div>
              <div className={styles.exampleRow}>
                <span className={styles.exLabel}>Output:</span>
                <span className={styles.exCode}>{challenge.exampleOutput}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
             <h3 className={styles.sectionTitle}>Constraints</h3>
             <ul className={styles.constraintList}>
               {challenge.constraints.map((constraint, idx) => (
                 <li key={idx} className={styles.constraint}>{constraint}</li>
               ))}
             </ul>
          </div>

          <div className={styles.section}>
             <h3 className={styles.sectionTitle}>Notes</h3>
             <p className={styles.exText}>
               {challenge.notes}
             </p>
          </div>
        </aside>

        <main className={styles.editorPanel}>
          <div className={styles.editorToolbar}>
            <div className={styles.langSelector}>
              <select className={styles.langSelect} disabled>
                <option>JavaScript</option>
              </select>
              <ChevronDown size={14} className={styles.selectArrow} />
            </div>
            <div className={styles.editorActions}>
              <button className="btn btn-secondary btn-sm" onClick={handleRun} disabled={isRunning || isSuccess}>
                {isRunning ? <div className={styles.spinner} /> : <><Play size={12} /> Run</>}
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => setShowConfirm(true)} disabled={isRunning || isSuccess}>
                <Send size={12} /> Submit
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => onNext(0)} disabled={isRunning || isSuccess}>
                <SkipForward size={12} /> Skip
              </button>
            </div>
          </div>

          <div className={styles.editorContainer}>
            <div className={styles.lineNumbers}>
              {Array.from({ length: Math.max(15, lineCount) }).map((_, i) => (
                <span key={i} className={styles.lineNum}>{i + 1}</span>
              ))}
            </div>
            <textarea
              className={styles.codeEditor}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              autoFocus
            />
          </div>

          <div className={styles.outputPanel}>
            <div className={styles.outputHeader}>
              <Terminal size={14} /> Output Console
            </div>
            <div className={styles.outputContent}>
              {output}
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
  );
}
