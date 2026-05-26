'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Target, Zap, Upload, CheckCircle2, TrendingUp, BarChart3 } from 'lucide-react'
import { useClerk } from '@clerk/react'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('features')
  const { openSignIn, openSignUp } = useClerk()
  const router = useRouter()

  return (
    <div id="app">
      {/* Top Navigation */}
      <div className="topbar">
        <div className="brand">
          <div className="brand-mark">RS</div>
          <span>ResumeScore</span>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'features' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('features')}
          >
            Features
          </button>
          <button
            className={`tab ${activeTab === 'pricing' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            Pricing
          </button>
          <button
            className={`tab ${activeTab === 'about' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
        </div>

        <div className="topbar-right">
          <button className="btn btn-ghost btn-sm" onClick={() => openSignIn()}>Log In</button>
          <button className="btn btn-primary btn-sm" onClick={() => openSignUp()}>Sign Up</button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="page">
        <div className="tpl-landing">
          <div className="tpl-hero">
            <div className="tpl-hero-left">
              <div className="pill pill-lime">
                <Sparkles size={14} />
                AI-Powered Resume Analysis
              </div>

              <h1 className="tpl-hero-title t-display-2">
                Match Your Resume to Any{' '}
                <span className="tpl-italic">Job Description</span>
              </h1>

              <p className="page-sub" style={{ maxWidth: '48ch', marginTop: '20px' }}>
                Upload your CV and job description to get an instant compatibility score.
                Our AI analyzes key skills, experience, and requirements to help you stand out.
              </p>

              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button className="btn btn-primary btn-lg" onClick={() => router.push('/upload')}>
                  <Upload size={18} />
                  Try It Now
                </button>
              </div>

              {/* Stats */}
              <div className="tpl-hero-stats">
                <div className="tpl-stat">
                  <div className="tpl-stat-n">98%</div>
                  <div className="t-body-sm t-muted">Accuracy</div>
                </div>
                <div className="tpl-stat">
                  <div className="tpl-stat-n">50K+</div>
                  <div className="t-body-sm t-muted">Resumes</div>
                </div>
                <div className="tpl-stat">
                  <div className="tpl-stat-n">2.5s</div>
                  <div className="t-body-sm t-muted">Avg. Time</div>
                </div>
                <div className="tpl-stat">
                  <div className="tpl-stat-n">4.9★</div>
                  <div className="t-body-sm t-muted">Rating</div>
                </div>
              </div>
            </div>

            {/* Hero Visual — Score Card Demo */}
            <div style={{ position: 'relative' }}>
              <div className="card" style={{ padding: '32px', minHeight: '480px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="t-eyebrow">Resume Analysis</div>
                  <div className="pill pill-lime">
                    <CheckCircle2 size={12} />
                    Complete
                  </div>
                </div>

                {/* Score Display */}
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div className="t-eyebrow" style={{ marginBottom: '16px' }}>Match Score</div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(72px, 8vw, 96px)',
                    fontWeight: '600',
                    letterSpacing: '-0.04em',
                    lineHeight: '1',
                    background: 'linear-gradient(135deg, var(--rs-lime), #7FE54D)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    marginBottom: '8px',
                  }}>
                    87
                  </div>
                  <div className="t-body t-muted">Strong Match</div>
                </div>

                {/* Key Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="t-body-sm t-muted">Skills Match</span>
                      <span className="t-body-sm" style={{ fontWeight: '600' }}>92%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-fill" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="t-body-sm t-muted">Experience</span>
                      <span className="t-body-sm" style={{ fontWeight: '600' }}>85%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-fill progress-fill-yellow" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="t-body-sm t-muted">Keywords</span>
                      <span className="t-body-sm" style={{ fontWeight: '600' }}>84%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-fill" style={{ width: '84%' }} />
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" style={{ marginTop: 'auto' }}>
                  View Detailed Report
                </button>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="tpl-features">
            <div className="card tpl-feature">
              <div className="card-icon card-icon-lime">
                <Target size={20} />
              </div>
              <h3 className="t-h4" style={{ marginTop: '16px', marginBottom: '8px' }}>
                Smart Matching
              </h3>
              <p className="t-body-sm t-muted">
                AI-powered analysis compares your resume against job requirements to identify strengths and gaps.
              </p>
              <div className="card-foot">
                <span className="tpl-feature-n t-eyebrow">01</span>
              </div>
            </div>

            <div className="card tpl-feature">
              <div className="card-icon card-icon-yellow">
                <Sparkles size={20} />
              </div>
              <h3 className="t-h4" style={{ marginTop: '16px', marginBottom: '8px' }}>
                Instant Feedback
              </h3>
              <p className="t-body-sm t-muted">
                Get your compatibility score in seconds with detailed breakdowns of skills, experience, and keywords.
              </p>
              <div className="card-foot">
                <span className="tpl-feature-n t-eyebrow">02</span>
              </div>
            </div>

            <div className="card tpl-feature">
              <div className="card-icon card-icon-teal">
                <TrendingUp size={20} />
              </div>
              <h3 className="t-h4" style={{ marginTop: '16px', marginBottom: '8px' }}>
                Actionable Insights
              </h3>
              <p className="t-body-sm t-muted">
                Receive specific recommendations to improve your resume and increase your match score.
              </p>
              <div className="card-foot">
                <span className="tpl-feature-n t-eyebrow">03</span>
              </div>
            </div>

            <div className="card tpl-feature">
              <div className="card-icon card-icon-lime">
                <BarChart3 size={20} />
              </div>
              <h3 className="t-h4" style={{ marginTop: '16px', marginBottom: '8px' }}>
                Track Progress
              </h3>
              <p className="t-body-sm t-muted">
                Monitor improvements over time and see how your changes impact your compatibility score.
              </p>
              <div className="card-foot">
                <span className="tpl-feature-n t-eyebrow">04</span>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="section">
          <div className="section-head">
            <div>
              <h2 className="section-title">How It Works</h2>
              <p className="section-sub">Three simple steps to optimize your resume</p>
            </div>
          </div>

          <div className="grid grid-3">
            <div className="card" style={{ padding: '28px', minHeight: '240px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'var(--accent-bg)', border: '1px solid var(--accent-bd)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '600',
                color: 'var(--accent)', marginBottom: '20px',
              }}>
                1
              </div>
              <h3 className="t-h4" style={{ marginBottom: '12px' }}>Upload Documents</h3>
              <p className="t-body-sm t-muted">
                Upload your resume and paste the job description you&apos;re applying for. We support PDF, Word, and text formats.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', minHeight: '240px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'var(--warning-bg)', border: '1px solid var(--warning-bd)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '600',
                color: 'var(--warning)', marginBottom: '20px',
              }}>
                2
              </div>
              <h3 className="t-h4" style={{ marginBottom: '12px' }}>AI Analysis</h3>
              <p className="t-body-sm t-muted">
                Our AI engine analyzes both documents, comparing skills, experience, education, and key requirements.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', minHeight: '240px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'var(--teal-bg)', border: '1px solid var(--teal-bd)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '600',
                color: '#B6D8DD', marginBottom: '20px',
              }}>
                3
              </div>
              <h3 className="t-h4" style={{ marginBottom: '12px' }}>Get Your Score</h3>
              <p className="t-body-sm t-muted">
                Receive a detailed compatibility score with specific recommendations to improve your application.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="section">
          <div className="card-promo">
            <div style={{ maxWidth: '60ch', position: 'relative', zIndex: 1 }}>
              <div className="promo-tag" style={{ marginBottom: '20px' }}>Free Trial</div>
              <h2 className="t-h1" style={{ marginBottom: '16px' }}>
                Ready to Land Your Dream Job?
              </h2>
              <p className="t-body-lg t-muted" style={{ marginBottom: '28px' }}>
                Start analyzing your resume today. Get 3 free scans to see how you match up against any job description.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary btn-lg" onClick={() => router.push('/upload')}>
                  <Zap size={18} />
                  Start Free Trial
                </button>
                <button className="btn btn-secondary btn-lg">
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="foot">
        <div>© 2026 ResumeScore. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="#" style={{ color: 'var(--text-45)' }}>Privacy</a>
          <a href="#" style={{ color: 'var(--text-45)' }}>Terms</a>
          <a href="#" style={{ color: 'var(--text-45)' }}>Contact</a>
        </div>
      </div>
    </div>
  )
}
