'use client';
import { useState, useEffect } from 'react';
import { User, Mail, Briefcase, BarChart2, Code, Upload, ChevronRight, ArrowLeft, Brain, Save, X, Plus } from 'lucide-react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import styles from './CandidateDetailsScreen.module.css';

interface CandidateData {
  fullName: string;
  email: string;
  role: string;
  experience: string;
  skills: string[];
  resumeName: string;
}

interface CandidateDetailsScreenProps {
  onBack: () => void;
  onNext: (data: CandidateData) => void;
}

const ROLES = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'ML Engineer', 'DevOps Engineer', 'Product Manager', 'UI/UX Designer', 'Mobile Developer', 'Cloud Architect'];
const EXPERIENCE_LEVELS = ['Fresher (0-1 years)', 'Junior (1-3 years)', 'Mid-level (3-5 years)', 'Senior (5-8 years)', 'Lead/Principal (8+ years)'];
const SUGGESTED_SKILLS = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'REST APIs', 'Git'];

export default function CandidateDetailsScreen({ onBack, onNext }: CandidateDetailsScreenProps) {
  const [form, setForm] = useState<CandidateData>({
    fullName: '', email: '', role: '', experience: '', skills: [], resumeName: '',
  });
  const [errors, setErrors] = useState<Partial<CandidateData>>({});
  const [skillInput, setSkillInput] = useState('');


  const validate = () => {
    const e: Partial<Record<keyof CandidateData, string>> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address';
    if (!form.role) e.role = 'Please select a role';
    if (!form.experience) e.experience = 'Please select your experience level';
    if (form.skills.length === 0) e.skills = 'Add at least one skill' as unknown as string;
    setErrors(e as Partial<CandidateData>);
    return Object.keys(e).length === 0;
  };

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !form.skills.includes(s)) {
      setForm(f => ({ ...f, skills: [...f.skills, s] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
  };

  const handleSubmit = () => {
    if (validate()) onNext(form);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm(f => ({ ...f, resumeName: file.name }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.bgOrb} />
      </div>

      <header className={styles.header}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}><Brain size={18} /></div>
            <span>Interview<span className="text-gradient">AI</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.formWrapper}>
          <div className={styles.stepIndicator}>
            {['Details', 'Setup', 'Interview'].map((s, i) => (
              <div key={i} className={`${styles.step} ${i === 0 ? styles.stepActive : styles.stepPending}`}>
                <div className={styles.stepDot}>{i === 0 ? '1' : i + 1}</div>
                <span>{s}</span>
                {i < 2 && <div className={styles.stepLine} />}
              </div>
            ))}
          </div>

          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h1 className={styles.formTitle}>Candidate Profile</h1>
              <p className={styles.formDesc}>Tell us about yourself so the AI can tailor your interview experience.</p>
            </div>

            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">
                  <User size={13} style={{ display: 'inline', marginRight: 4 }} />
                  Full Name
                </label>
                <input
                  id="fullName"
                  className={`form-input ${errors.fullName ? styles.inputError : ''}`}
                  placeholder="e.g. Aisha Sharma"
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  <Mail size={13} style={{ display: 'inline', marginRight: 4 }} />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className={`form-input ${errors.email ? styles.inputError : ''}`}
                  placeholder="e.g. aisha@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="role">
                  <Briefcase size={13} style={{ display: 'inline', marginRight: 4 }} />
                  Role Applied For
                </label>
                <select
                  id="role"
                  className={`form-select ${errors.role ? styles.inputError : ''}`}
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                >
                  <option value="">Select a role...</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.role && <span className="form-error">{errors.role}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="experience">
                  <BarChart2 size={13} style={{ display: 'inline', marginRight: 4 }} />
                  Experience Level
                </label>
                <select
                  id="experience"
                  className={`form-select ${errors.experience ? styles.inputError : ''}`}
                  value={form.experience}
                  onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                >
                  <option value="">Select experience level...</option>
                  {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.experience && <span className="form-error">{errors.experience}</span>}
              </div>

              <div className={`form-group ${styles.fullWidth}`}>
                <label className="form-label">
                  <Code size={13} style={{ display: 'inline', marginRight: 4 }} />
                  Skills / Technologies
                </label>
                <div className={styles.skillInput}>
                  <input
                    id="skillInput"
                    className="form-input"
                    placeholder="Type a skill and press Enter..."
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                  />
                  <button className={`btn btn-secondary btn-sm ${styles.addBtn}`} onClick={() => addSkill(skillInput)}>
                    <Plus size={14} />
                  </button>
                </div>
                <div className={styles.skillSuggestions}>
                  {SUGGESTED_SKILLS.filter(s => !form.skills.includes(s)).slice(0, 6).map(s => (
                    <button key={s} className={styles.suggestion} onClick={() => addSkill(s)}>{s}</button>
                  ))}
                </div>
                <div className={styles.skillTags}>
                  {form.skills.map(s => (
                    <span key={s} className={styles.skillTag}>
                      {s}
                      <button onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}><X size={12} /></button>
                    </span>
                  ))}
                </div>
                {errors.skills && <span className="form-error">{String(errors.skills)}</span>}
              </div>

              <div className={`form-group ${styles.fullWidth}`}>
                <label className="form-label">
                  <Upload size={13} style={{ display: 'inline', marginRight: 4 }} />
                  Upload Resume <span className={styles.optional}>(Optional)</span>
                </label>
                <label className={styles.uploadArea} htmlFor="resumeInput">
                  <Upload size={24} className={styles.uploadIcon} />
                  {form.resumeName ? (
                    <div className={styles.uploadedFile}>
                      <span>{form.resumeName}</span>
                      <span className="badge badge-green">Uploaded</span>
                    </div>
                  ) : (
                    <>
                      <span className={styles.uploadText}>Drag & drop your resume here, or <u>browse</u></span>
                      <span className={styles.uploadHint}>Supports PDF, DOC, DOCX (Max 5MB)</span>
                    </>
                  )}
                  <input id="resumeInput" type="file" accept=".pdf,.doc,.docx" hidden onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <div className={styles.formActions}>
              <button className="btn btn-ghost" onClick={onBack}>
                <ArrowLeft size={16} />
                Back
              </button>
              <button id="candidate-next-btn" className="btn btn-primary" onClick={handleSubmit}>
                Continue to Setup
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
