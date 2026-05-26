'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '../components/Icon'
import { useTheme } from '../hooks/useTheme'
import { extractPdfText } from '../lib/extractPdfText'

const ANALYZING_LINES = [
  'Reading your resume…',
  'Decoding the job description…',
  'Matching skills against requirements…',
  'Weighing your experience…',
  'Scanning for keywords and signals…',
  'Scoring the match — almost there…',
]

const DEFAULT_WEIGHTS = {
  skills_match: 28,
  seniority: 16,
  culture_fit: 14,
  stack_match: 20,
  education: 10,
  coachability: 12,
}

const WEIGHT_FIELDS = [
  { key: 'skills_match', label: 'Skills Match',  help: 'Overlap of required vs. demonstrated skills.' },
  { key: 'seniority',    label: 'Seniority',      help: 'Years and scope of relevant experience.' },
  { key: 'culture_fit',  label: 'Culture Fit',    help: 'Tone, values, and working style signals.' },
  { key: 'stack_match',  label: 'Stack Match',    help: 'Tools, frameworks, and tech alignment.' },
  { key: 'education',    label: 'Education',      help: 'Degrees, certifications, and relevant coursework.' },
  { key: 'coachability', label: 'Coachability',   help: 'Signals of growth, feedback, and learning velocity.' },
]

export default function UploadPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const [jd, setJd] = useState('')
  const [cv, setCv] = useState<File | null>(null)
  const [drag, setDrag] = useState(false)
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS)
  const [weightsOpen, setWeightsOpen] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [lineIdx, setLineIdx] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!analyzing) { setLineIdx(0); return }
    const id = setInterval(() => {
      setLineIdx(i => (i + 1) % ANALYZING_LINES.length)
    }, 1600)
    return () => clearInterval(id)
  }, [analyzing])

  const canSubmit = jd.trim().length > 20 && !!cv

  const handleFile = (file: File | undefined) => {
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file.')
      return
    }
    setCv(file)
  }

  const handleAnalyze = async () => {
    if (!canSubmit || !cv) return
    const controller = new AbortController()
    abortRef.current = controller
    setAnalyzing(true)
    setError(null)
    try {
      const resumeText = await extractPdfText(cv)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/api/screen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd, resume: resumeText, weights }),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      sessionStorage.setItem('screeningResult', JSON.stringify(data))
      router.push('/score')
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      console.error('Analysis failed:', err)
      setAnalyzing(false)
      setError('Analysis failed — please check the backend is running and try again.')
    }
  }

  const updateWeight = (key: string, v: string) =>
    setWeights(w => ({ ...w, [key]: Number(v) }))

  const weightsTotal = WEIGHT_FIELDS.reduce((s, f) => s + (weights[f.key as keyof typeof weights] || 0), 0) || 1

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
        <div className={`rs-upload${analyzing ? ' is-analyzing' : ''}`}>
          <div className="rs-upload-inner">

            {/* Header */}
            <header className="rs-upload-head">
              <button className="btn btn-ghost btn-sm" onClick={() => router.push('/')}>
                <Icon name="arrowLeft" size={14} />
                Back to Home
              </button>
              <div className="rs-step">
                <span className="rs-step-dot is-on" />
                <span className="rs-step-label">Step 1 of 2</span>
                <span className="rs-step-line" />
                <span className="rs-step-dot" />
              </div>
            </header>

            {/* Hero */}
            <div className="rs-upload-hero">
              <span className="rs-eyebrow-pill" style={{ margin: '10px 0 0' }}>
                <Icon name="file" size={14} />
                Upload &amp; Analyze
              </span>
              <h1 className="rs-upload-title">
                Add the <span className="rs-title-accent">Job &amp; Resume</span>
              </h1>
              <p className="rs-upload-sub">
                Paste the job description, drop in your CV, then we&apos;ll do the rest.
              </p>
            </div>

            {/* Two cards */}
            <div className="rs-upload-grid" style={{ margin: '10px 0 20px' }}>
              {/* Job description */}
              <section className="rs-upload-card">
                <header className="rs-up-card-head">
                  <div className="rs-up-card-icon rs-tone-yellow">
                    <Icon name="inbox" size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 className="rs-up-card-title">Job Description</h2>
                    <p className="rs-up-card-sub">Paste the role you&apos;re targeting</p>
                  </div>
                  {jd.trim().length >= 20 ? (
                    <span className="pill pill-lime">
                      <Icon name="check" size={12} />
                      Ready
                    </span>
                  ) : (
                    <span className="pill" style={{ fontFamily: 'var(--font-mono)', letterSpacing: 0 }}>
                      {jd.trim().length}/20
                    </span>
                  )}
                </header>

                <textarea
                  className="input textarea rs-up-textarea"
                  placeholder={"Paste the full job description here…\n\nInclude requirements, responsibilities, and the tech stack for the best match."}
                  value={jd}
                  onChange={e => setJd(e.target.value)}
                />

                <footer className="rs-up-card-foot">
                  <span className="t-faint t-body-sm">
                    <Icon name="shield" size={12} style={{ verticalAlign: '-2px', marginRight: 6 }} />
                    We don&apos;t store your data.
                  </span>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setJd('')}
                    disabled={!jd}
                    style={{ opacity: jd ? 1 : 0.4 }}
                  >
                    <Icon name="trash" size={12} />
                    Clear
                  </button>
                </footer>
              </section>

              {/* CV upload */}
              <section className="rs-upload-card">
                <header className="rs-up-card-head">
                  <div className="rs-up-card-icon rs-tone-lime">
                    <Icon name="file" size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 className="rs-up-card-title">Your CV</h2>
                    <p className="rs-up-card-sub">PDF only · 10 MB max</p>
                  </div>
                  <span className={`pill ${cv ? 'pill-lime' : ''}`}>
                    {cv && <Icon name="check" size={12} />}
                    {cv ? 'Attached' : 'Pending'}
                  </span>
                </header>

                <div
                  className={`rs-drop ${drag ? 'is-drag' : ''} ${cv ? 'is-filled' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDrag(true) }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]) }}
                  onClick={() => fileInput.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && fileInput.current?.click()}
                >
                  <input
                    ref={fileInput}
                    type="file"
                    accept="application/pdf,.pdf"
                    hidden
                    onChange={e => handleFile(e.target.files?.[0])}
                  />

                  {!cv ? (
                    <>
                      <div className="rs-drop-icon">
                        <Icon name="download" size={28} />
                      </div>
                      <p className="rs-drop-title">Drop your PDF here</p>
                      <p className="rs-drop-sub">or click to browse</p>
                      <span className="rs-drop-tag">other formats coming soon</span>
                    </>
                  ) : (
                    <>
                      <div className="rs-drop-icon rs-drop-icon-filled">
                        <Icon name="check" size={26} />
                      </div>
                      <p className="rs-drop-title">{cv.name}</p>
                      <p className="rs-drop-sub">{(cv.size / 1024).toFixed(0)} KB · PDF</p>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={e => { e.stopPropagation(); setCv(null) }}
                        style={{ marginTop: 12 }}
                      >
                        <Icon name="close" size={12} />
                        Remove
                      </button>
                    </>
                  )}
                </div>

                <footer className="rs-up-card-foot">
                  <span className="t-faint t-body-sm">
                    <Icon name="lock" size={12} style={{ verticalAlign: '-2px', marginRight: 6 }} />
                    Encrypted in transit.
                  </span>
                </footer>
              </section>
            </div>

            {/* Weights accordion */}
            <section className={`rs-weights${weightsOpen ? ' is-open' : ''}`} style={{ padding: 0 }}>
              <button
                className="rs-weights-head"
                aria-expanded={weightsOpen}
                aria-controls="rs-weights-body"
                onClick={() => setWeightsOpen(o => !o)}
                type="button"
                style={{ padding: '16px 20px', margin: 0 }}
              >
                <span className="rs-weights-icon"><Icon name="sliders" size={16} /></span>
                <span className="rs-weights-text">
                  <span className="rs-weights-title">Scoring weights</span>
                  <span className="rs-weights-sub">Tune how much each signal contributes to the match score.</span>
                </span>
                <span className="rs-weights-summary">
                  {WEIGHT_FIELDS.map(f => (
                    <span key={f.key} className="rs-weights-chip" title={f.label}>
                      {Math.round(weights[f.key as keyof typeof weights] / weightsTotal * 100)}%
                    </span>
                  ))}
                </span>
                <span className="rs-weights-chev" aria-hidden="true">
                  <Icon name="chevronDown" size={16} />
                </span>
              </button>

              {weightsOpen && (
                <div className="rs-weights-body" id="rs-weights-body">
                  <div className="rs-weights-grid">
                    {WEIGHT_FIELDS.map(f => {
                      const v = weights[f.key as keyof typeof weights]
                      const pct = Math.round(v / weightsTotal * 100)
                      return (
                        <div key={f.key} className="rs-weight">
                          <div className="rs-weight-head">
                            <div className="rs-weight-label">
                              <span className="rs-weight-name">{f.label}</span>
                            </div>
                            <span className="rs-weight-pct">
                              <span>{pct}</span>
                              <span className="rs-weight-pct-u">%</span>
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={v}
                            onChange={e => updateWeight(f.key, e.target.value)}
                            className="rs-weight-slider"
                            style={{ '--rs-fill': `${v}%` } as React.CSSProperties}
                            aria-label={`${f.label} weight`}
                          />
                          <p className="rs-weight-help">{f.help}</p>
                        </div>
                      )
                    })}
                  </div>

                  <footer className="rs-weights-foot">
                    <span className="t-faint t-body-sm">
                      Normalized to 100% · raw total {WEIGHT_FIELDS.reduce((s, f) => s + weights[f.key as keyof typeof weights], 0)}
                    </span>
                    <button className="btn btn-ghost btn-sm" type="button" onClick={() => setWeights(DEFAULT_WEIGHTS)}>
                      <Icon name="refresh" size={12} />
                      Reset
                    </button>
                  </footer>
                </div>
              )}
            </section>

            {/* Submit bar */}
            <div className="rs-upload-submit" style={{ padding: '18px 24px', margin: '20px 1px 1px' }}>
              <div className="rs-submit-meta">
                <span className="t-eyebrow">Next</span>
                <p className="t-body-sm t-muted">We&apos;ll analyze the match in ~2.5s.</p>
              </div>
              <button
                className="btn btn-primary btn-lg"
                disabled={!canSubmit}
                style={{ cursor: canSubmit ? 'pointer' : 'not-allowed' }}
                onClick={handleAnalyze}
              >
                Analyze Match
                <Icon name="arrowRight" size={16} />
              </button>
            </div>

            {error && (
              <p style={{ color: 'var(--rs-yellow)', marginTop: 12, marginBottom: 0, fontSize: 13, textAlign: 'center', padding: '0 24px' }}>
                {error}
              </p>
            )}

          </div>

          {/* Analyzing overlay */}
          {analyzing && (
            <div className="rs-analyzing" role="status" aria-live="polite">
              <div className="rs-analyzing-scrim" />
              <div className="rs-analyzing-card">
                <div className="rs-analyzing-orb" aria-hidden="true">
                  <span className="rs-orb-ring rs-orb-ring-1" />
                  <span className="rs-orb-ring rs-orb-ring-2" />
                  <span className="rs-orb-ring rs-orb-ring-3" />
                  <span className="rs-orb-core"><Icon name="zap" size={26} /></span>
                </div>

                <span className="rs-analyzing-eyebrow">Analyzing match</span>

                <div className="rs-analyzing-lines">
                  <p key={lineIdx} className="rs-analyzing-line">{ANALYZING_LINES[lineIdx]}</p>
                </div>

                <div className="rs-analyzing-dots" aria-hidden="true">
                  {Array.from({ length: ANALYZING_LINES.length }).map((_, i) => (
                    <span
                      key={i}
                      className={`rs-analyzing-dot${i === lineIdx ? ' is-on' : ''}${i < lineIdx ? ' is-done' : ''}`}
                    />
                  ))}
                </div>

                <button className="btn btn-ghost btn-sm rs-analyzing-cancel" onClick={() => { abortRef.current?.abort(); setAnalyzing(false) }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
