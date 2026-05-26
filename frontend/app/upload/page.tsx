'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Sparkles, Upload, CheckCircle2 } from 'lucide-react'

export default function UploadPage() {
  const router = useRouter()
  const [jobDescription, setJobDescription] = useState('')
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setCvFile(file)
    } else {
      alert('Please upload a PDF file')
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setCvFile(file)
    } else {
      alert('Please upload a PDF file')
    }
  }

  const handleSubmit = () => {
    if (!jobDescription.trim()) { alert('Please enter a job description'); return }
    if (!cvFile) { alert('Please upload your CV'); return }
    // TODO: call POST /api/screen
    console.log('Analyzing...', { jobDescription, cvFile })
  }

  return (
    <div id="app">
      {/* Top Navigation */}
      <div className="topbar">
        <div
          className="brand"
          style={{ cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          <div className="brand-mark">RS</div>
          <span>ResumeScore</span>
        </div>

        <div className="topbar-right">
          <button className="btn btn-ghost btn-sm" onClick={() => router.push('/')}>
            Back to Home
          </button>
        </div>
      </div>

      {/* Upload Page */}
      <div className="page">
        <div className="page-header">
          <div>
            <div className="page-eyebrow">Step 1 of 2</div>
            <h1 className="page-title">Upload Your Documents</h1>
            <p className="page-sub">
              Provide your CV and the job description to get an instant compatibility analysis
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>

          {/* Job Description */}
          <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '11px',
                background: 'var(--accent-bg)', border: '1px solid var(--accent-bd)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)',
              }}>
                <FileText size={20} />
              </div>
              <div>
                <h3 className="t-h4">Job Description</h3>
                <p className="t-body-sm t-muted">Paste the job posting</p>
              </div>
            </div>

            <textarea
              className="input textarea"
              placeholder={"Paste the full job description here...\n\nExample:\nWe are looking for a Senior Software Engineer with 5+ years of experience in React, TypeScript, and Node.js..."}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{ resize: 'none', flex: 1, minHeight: '340px' }}
            />
            <div className="t-body-sm t-faint" style={{ marginTop: '8px' }}>
              Include all requirements and qualifications
            </div>
          </div>

          {/* CV Upload */}
          <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '11px',
                background: 'var(--warning-bg)', border: '1px solid var(--warning-bd)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--warning)',
              }}>
                <Upload size={20} />
              </div>
              <div>
                <h3 className="t-h4">Your CV/Resume</h3>
                <p className="t-body-sm t-muted">Upload as PDF</p>
              </div>
            </div>

            <div
              style={{
                border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--r-lg)',
                padding: '48px 32px',
                textAlign: 'center',
                background: dragOver ? 'var(--accent-bg)' : 'var(--bg-glass)',
                transition: 'all var(--tr-base)',
                cursor: 'pointer',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('cv-upload')?.click()}
            >
              {cvFile ? (
                <div>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: 'var(--r-lg)',
                    background: 'var(--accent-bg)', border: '1px solid var(--accent-bd)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px', color: 'var(--accent)',
                  }}>
                    <FileText size={28} />
                  </div>
                  <p className="t-h4" style={{ marginBottom: '8px' }}>{cvFile.name}</p>
                  <p className="t-body-sm t-muted" style={{ marginBottom: '12px' }}>
                    {(cvFile.size / 1024).toFixed(1)} KB · PDF
                  </p>
                  <div className="pill pill-lime">
                    <CheckCircle2 size={14} />
                    Ready to analyze
                  </div>
                </div>
              ) : (
                <div>
                  <Upload size={48} style={{ color: 'var(--text-45)', margin: '0 auto 16px', display: 'block' }} />
                  <p className="t-h4" style={{ marginBottom: '8px' }}>
                    Drop your PDF here or click to browse
                  </p>
                  <p className="t-body-sm t-muted">PDF format only, max 10MB</p>
                </div>
              )}
              <input
                id="cv-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            <div className="t-body-sm t-faint" style={{ marginTop: '8px' }}>
              Supports PDF files up to 10MB
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={!jobDescription.trim() || !cvFile}
            style={{ opacity: (!jobDescription.trim() || !cvFile) ? 0.5 : 1 }}
          >
            <Sparkles size={18} />
            Analyze Resume
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="foot">
        <div>© 2026 ResumeScore. All rights reserved.</div>
      </div>
    </div>
  )
}
