'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '../components/Icon'
import { useTheme } from '../hooks/useTheme'

const WEIGHT_LABELS: Record<string, string> = {
  skills_match: 'Skills Match',
  seniority: 'Seniority',
  culture_fit: 'Culture Fit',
  stack_match: 'Stack Match',
  education: 'Education',
  coachability: 'Coachability',
}

type ScreeningResult = {
  screening_id: string
  score: number
  summary: string
  strengths: { title: string; body: string }[]
  gaps: { title: string; body: string }[]
  tips: string[]
  breakdown: Record<string, number>
}

export default function ScorePage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [result, setResult] = useState<ScreeningResult | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('screeningResult')
    if (!raw) { router.replace('/upload'); return }
    setResult(JSON.parse(raw))
  }, [router])

  if (!result) return null

  const { score, summary, strengths, gaps, tips, breakdown } = result
  const r = 56
  const c = 2 * Math.PI * r
  const offset = c * (1 - score / 100)

  const sideBars = Object.entries(breakdown).map(([key, value]) => ({
    label: WEIGHT_LABELS[key] ?? key,
    value,
    tone: value >= 80 ? 'lime' : value >= 60 ? 'teal' : 'yellow',
  }))

  const scoreLabel = score >= 80 ? 'Strong Match' : score >= 60 ? 'Good Match' : 'Partial Match'
  const heroLabel = score >= 80 ? 'strong match' : score >= 60 ? 'good match' : 'partial match'

  return (
    <div id="app" className="rs-app">
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" onClick={() => router.push('/')}>
            <div className="brand-mark" aria-hidden="true">RS</div>
            <span>ResumeScore</span>
          </a>
          <div className="topbar-right">
            <div className="theme-toggle" role="group" aria-label="Theme">
              <button className={theme === 'dark' ? 'is-active' : ''} onClick={() => setTheme('dark')} title="Dark">
                <Icon name="moon" size={12} />
              </button>
              <button className={theme === 'light' ? 'is-active' : ''} onClick={() => setTheme('light')} title="Light">
                <Icon name="sun" size={12} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="page">
        <div className="rs-score-page">
          {/* Header */}
          <header className="rs-upload-head">
            <button className="btn btn-ghost btn-sm" onClick={() => router.push('/upload')}>
              <Icon name="arrowLeft" size={14} />
              Run another analysis
            </button>
            <div className="rs-step">
              <span className="rs-step-dot is-done" />
              <span className="rs-step-line is-done" />
              <span className="rs-step-dot is-on" />
              <span className="rs-step-label">Step 2 of 2 · Results</span>
            </div>
          </header>

          {/* Hero */}
          <div className="rs-upload-hero">
            <span className="rs-eyebrow-pill">
              <Icon name="check" size={14} />
              Analysis complete
            </span>
            <h1 className="rs-upload-title">
              You&apos;re a <span className="rs-title-accent">{heroLabel}</span>
            </h1>
            <p className="rs-upload-sub">
              Here&apos;s the breakdown — what to lean into, and the few things that would lift your score the most.
            </p>
          </div>

          {/* Two-column results */}
          <div className="rs-score-grid">
            {/* LEFT — AI report */}
            <section className="rs-report">
              <header className="rs-report-head">
                <div className="rs-up-card-icon rs-tone-yellow">
                  <Icon name="sparkle" size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 className="rs-up-card-title">AI Report</h2>
                  <p className="rs-up-card-sub">Reviewed by AI</p>
                </div>
                <span className="pill pill-lime">
                  <Icon name="check" size={12} />
                  Reviewed
                </span>
              </header>

              <p className="rs-report-summary">{summary}</p>

              {/* Strengths */}
              <section className="rs-report-section">
                <h3 className="rs-report-h3">
                  <span className="rs-report-dot rs-tone-lime" style={{ background: 'var(--rs-lime)' }} />
                  What&apos;s working
                </h3>
                <ul className="rs-report-list">
                  {strengths.map(s => (
                    <li key={s.title} className="rs-report-item">
                      <span className="rs-report-bullet rs-bullet-lime">
                        <Icon name="check" size={11} />
                      </span>
                      <div>
                        <p className="rs-report-item-title">{s.title}</p>
                        <p className="rs-report-item-body">{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Gaps */}
              <section className="rs-report-section">
                <h3 className="rs-report-h3">
                  <span className="rs-report-dot" style={{ background: 'var(--rs-yellow)' }} />
                  Where you&apos;re losing points
                </h3>
                <ul className="rs-report-list">
                  {gaps.map(g => (
                    <li key={g.title} className="rs-report-item">
                      <span className="rs-report-bullet rs-bullet-yellow">!</span>
                      <div>
                        <p className="rs-report-item-title">{g.title}</p>
                        <p className="rs-report-item-body">{g.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Tips */}
              <section className="rs-report-section">
                <h3 className="rs-report-h3">
                  <span className="rs-report-dot" style={{ background: 'var(--rs-teal)' }} />
                  Quick tips to lift the score
                </h3>
                <ol className="rs-tips-list">
                  {tips.map((t, i) => (
                    <li key={i} className="rs-tip">
                      <span className="rs-tip-n">{i + 1}</span>
                      <p>{t}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <footer className="rs-report-foot">
                <button className="btn btn-ghost btn-sm">
                  <Icon name="download" size={12} />
                  Download report (PDF)
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => router.push('/upload')}>
                  <Icon name="refresh" size={12} />
                  Re-run with new weights
                </button>
              </footer>
            </section>

            {/* RIGHT — score card */}
            <aside className="rs-score-side">
              {/* Big donut */}
              <div className="rs-score-card rs-score-card-lg">
                <header className="rs-score-head">
                  <span className="rs-score-eyebrow">RESUME ANALYSIS</span>
                  <span className="rs-score-complete">
                    <Icon name="check" size={12} />
                    Complete
                  </span>
                </header>

                <div className="rs-score-body">
                  <p className="rs-score-label">MATCH SCORE</p>

                  <div className="rs-donut rs-donut-lg">
                    <span className="rs-donut-glow" aria-hidden="true" />
                    <svg viewBox="0 0 140 140" width="160" height="160" style={{ overflow: 'visible' }}>
                      <circle cx="70" cy="70" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
                      <circle
                        cx="70" cy="70" r={r}
                        stroke="var(--rs-lime)"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={c}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 70 70)"
                      />
                    </svg>
                    <div className="rs-donut-center">
                      <span className="rs-donut-n">{score}</span>
                      <span className="rs-donut-d">/ 100</span>
                    </div>
                  </div>

                  <p className="rs-score-tag">{scoreLabel}</p>

                  <div className="rs-bars">
                    {sideBars.map(bar => (
                      <div key={bar.label} className="rs-bar">
                        <div className="rs-bar-head">
                          <span>{bar.label}</span>
                          <span className="rs-bar-pct">{bar.value}%</span>
                        </div>
                        <div className="rs-bar-track">
                          <div className={`rs-bar-fill rs-tone-${bar.tone}`} style={{ width: `${bar.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
