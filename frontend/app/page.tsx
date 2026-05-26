'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/react'
import Icon from './components/Icon'
import { useTheme } from './hooks/useTheme'

const TABS = [
  { id: 'features', label: 'Features' },
  { id: 'pricing',  label: 'Pricing' },
  { id: 'about',    label: 'About' },
]

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('features')
  const { theme, setTheme } = useTheme()
  const { openSignIn, openSignUp } = useClerk()
  const router = useRouter()

  const r = 56
  const c = 2 * Math.PI * r
  const offset = c * (1 - 87 / 100)

  return (
    <div id="app" className="rs-app">
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" onClick={() => router.push('/')}>
            <div className="brand-mark" aria-hidden="true">RS</div>
            <span>ResumeScore</span>
          </a>

          <nav className="tabs" role="tablist" aria-label="Sections">
            {TABS.map(t => (
              <button
                key={t.id}
                role="tab"
                aria-selected={activeTab === t.id}
                className={`tab${activeTab === t.id ? ' is-active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="topbar-right">
            <div className="theme-toggle" role="group" aria-label="Theme">
              <button
                className={theme === 'dark' ? 'is-active' : ''}
                onClick={() => setTheme('dark')}
                aria-label="Dark theme"
                title="Dark"
              >
                <Icon name="moon" size={12} />
              </button>
              <button
                className={theme === 'light' ? 'is-active' : ''}
                onClick={() => setTheme('light')}
                aria-label="Light theme"
                title="Light"
              >
                <Icon name="sun" size={12} />
              </button>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => openSignIn({ forceRedirectUrl: '/upload' })}>Sign In</button>
            <button className="btn btn-primary btn-sm" onClick={() => openSignUp({ forceRedirectUrl: '/upload' })}>Get Started</button>
          </div>
        </div>
      </header>

      <main className="page">
        <div className="rs-landing">
          {/* ===== HERO ===== */}
          <section className="rs-hero">
            <div className="rs-hero-bg" aria-hidden="true" />

            <div className="rs-hero-grid">
              {/* Left */}
              <div className="rs-hero-left">
                <span className="rs-eyebrow-pill">
                  <Icon name="zap" size={14} />
                  AI-Powered Resume Analysis
                </span>

                <h1 className="rs-hero-title">
                  Match Your Resume to{' '}
                  <span className="rs-title-accent">Any Job Description</span>
                </h1>

                <p className="rs-hero-sub">
                  Upload your CV and job description to get an instant compatibility
                  score. Our AI analyzes key skills, experience, and requirements
                  to help you stand out.
                </p>

                <div className="rs-hero-cta">
                  <button className="btn btn-primary btn-lg" onClick={() => router.push('/upload')}>
                    <Icon name="arrowUpRight" size={16} />
                    Try It Now
                  </button>
                </div>

                <dl className="rs-hero-stats">
                  <div className="rs-stat">
                    <dt className="rs-stat-n">98%</dt>
                    <dd className="rs-stat-l">Accuracy</dd>
                  </div>
                  <div className="rs-stat">
                    <dt className="rs-stat-n">50K+</dt>
                    <dd className="rs-stat-l">Resumes</dd>
                  </div>
                  <div className="rs-stat">
                    <dt className="rs-stat-n">2.5s</dt>
                    <dd className="rs-stat-l">Avg. Time</dd>
                  </div>
                  <div className="rs-stat">
                    <dt className="rs-stat-n">4.9<span className="rs-star">★</span></dt>
                    <dd className="rs-stat-l">Rating</dd>
                  </div>
                </dl>
              </div>

              {/* Right — score card demo */}
              <div className="rs-hero-right">
                <div className="rs-score-card">
                  <header className="rs-score-head">
                    <span className="rs-score-eyebrow">RESUME ANALYSIS</span>
                    <span className="rs-score-complete">
                      <Icon name="check" size={12} />
                      Complete
                    </span>
                  </header>

                  <div className="rs-score-body">
                    <p className="rs-score-label">MATCH SCORE</p>

                    <div className="rs-donut">
                      <span className="rs-donut-glow" aria-hidden="true" />
                      <svg viewBox="0 0 140 140" width="140" height="140" style={{ overflow: 'visible' }}>
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
                        <span className="rs-donut-n">87</span>
                        <span className="rs-donut-d">/ 100</span>
                      </div>
                    </div>

                    <p className="rs-score-tag">Strong Match</p>

                    <div className="rs-bars">
                      {[
                        { label: 'Skills Match', value: 92, tone: 'lime' },
                        { label: 'Experience',   value: 85, tone: 'yellow' },
                        { label: 'Keywords',     value: 84, tone: 'lime' },
                      ].map(bar => (
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

                    <button className="btn btn-primary btn-lg rs-score-cta" onClick={() => router.push('/upload')}>
                      View Detailed Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== FEATURES ===== */}
          <section className="rs-features">
            {[
              { tone: 'lime',   icon: 'layers',  title: 'Smart Matching',      body: 'AI-powered analysis compares your resume against job requirements to identify strengths and gaps.' },
              { tone: 'yellow', icon: 'zap',     title: 'Instant Feedback',    body: 'Get your compatibility score in seconds with detailed breakdowns of skills, experience, and keywords.' },
              { tone: 'teal',   icon: 'trending', title: 'Actionable Insights', body: 'Receive specific recommendations to improve your resume and increase your match score.' },
              { tone: 'lime',   icon: 'chart',   title: 'Track Progress',      body: 'Monitor improvements over time and see how your changes impact your compatibility score.' },
            ].map(f => (
              <article key={f.title} className="rs-feature">
                <div className={`rs-feature-icon rs-tone-${f.tone}`}>
                  <Icon name={f.icon} size={20} />
                </div>
                <h3 className="rs-feature-title">{f.title}</h3>
                <p className="rs-feature-body">{f.body}</p>
              </article>
            ))}
          </section>
        </div>
      </main>

      <footer className="foot">
        <div>© 2026 ResumeScore. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  )
}
