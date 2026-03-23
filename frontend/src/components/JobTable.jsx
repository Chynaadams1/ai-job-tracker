import { useState } from 'react'
import { updateJob } from '../api/jobs'
import axios from 'axios'

const statusColors = {
  applied: { bg: '#e3f2fd', color: '#1565c0' },
  interview: { bg: '#fff8e1', color: '#e65100' },
  offer: { bg: '#e8f5e9', color: '#2e7d32' },
  rejected: { bg: '#fce4ec', color: '#c62828' },
}

export default function JobTable({ jobs, filter, setFilter, onDelete, onRefresh }) {
  const [search, setSearch] = useState('')
  const [matchJob, setMatchJob] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [matchResult, setMatchResult] = useState(null)
  const [loadingMatch, setLoadingMatch] = useState(false)

  const filtered = jobs.filter(j =>
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.job_title.toLowerCase().includes(search.toLowerCase())
  )

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      alert('Please paste the job description!')
      return
    }
    setLoadingMatch(true)
    try {
      const res = await axios.post(
        `http://localhost:8000/jobs/${matchJob.id}/match`,
        { job_description: jobDescription }
      )
      setMatchResult(res.data)
    } catch (err) {
      alert('AI Match failed. Check your OpenAI key!')
    }
    setLoadingMatch(false)
  }

  const closeMatch = () => {
    setMatchJob(null)
    setJobDescription('')
    setMatchResult(null)
  }

  const scoreColor = (score) => {
    if (score >= 80) return '#2e7d32'
    if (score >= 60) return '#e65100'
    return '#c62828'
  }

  return (
    <div style={styles.wrap}>
      {/* Filters + Search */}
      <div style={styles.filterRow}>
        {['all', 'applied', 'interview', 'offer', 'rejected'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              ...styles.filterBtn,
              ...(filter === s ? styles.filterActive : {})
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Date Applied</th>
              <th style={styles.th}>Salary</th>
              <th style={styles.th}>Resume Submitted</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={styles.empty}>
                  No applications yet — add your first one! 🎀
                </td>
              </tr>
            ) : (
              filtered.map(job => (
                <tr key={job.id} style={styles.row}>
                  <td style={styles.td}>
                    <div style={styles.company}>
                      <div style={styles.companyDot}>
                        {job.company.charAt(0)}
                      </div>
                      {job.company}
                    </div>
                  </td>
                  <td style={styles.td}>{job.job_title}</td>
                  <td style={{ ...styles.td, color: '#c9a0b0' }}>
                    {new Date(job.date_applied).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>{job.salary || '—'}</td>
                  <td style={styles.td}>
                    {job.resume_submitted ? (
                      <div style={styles.resumeBtn}>
                        <div style={styles.pdfIcon}>PDF</div>
                        <div>
                          <div style={styles.resumeName}>{job.resume_submitted}</div>
                          <div style={styles.resumeSub}>Click to download</div>
                        </div>
                        <span style={styles.dlArrow}>↓</span>
                      </div>
                    ) : '—'}
                  </td>
                  <td style={styles.td}>
                    <select
                      value={job.status}
                      onChange={async (e) => {
                        await updateJob(job.id, { ...job, status: e.target.value })
                        onRefresh()
                      }}
                      style={{
                        ...styles.statusBadge,
                        background: statusColors[job.status]?.bg || '#f5f5f5',
                        color: statusColors[job.status]?.color || '#333',
                      }}
                    >
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => setMatchJob(job)}
                        style={styles.matchBtn}
                      >
                        ✨ AI
                      </button>
                      <button
                        onClick={() => onDelete(job.id)}
                        style={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        Showing {filtered.length} of {jobs.length} applications
      </div>

      {/* AI Match Modal */}
      {matchJob && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>✨ AI Match — {matchJob.company}</div>
              <button onClick={closeMatch} style={styles.closeBtn}>✕</button>
            </div>

            {!matchResult ? (
              <div style={styles.modalBody}>
                <p style={styles.modalSub}>
                  Paste the job description below and AI will score how well you match!
                </p>
                <textarea
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  style={styles.textarea}
                />
                <button
                  onClick={handleMatch}
                  style={styles.analyzeBtn}
                  disabled={loadingMatch}
                >
                  {loadingMatch ? '✨ Analyzing...' : '✨ Analyze Match'}
                </button>
              </div>
            ) : (
              <div style={styles.modalBody}>
                {/* Score */}
                <div style={styles.scoreBox}>
                  <div style={{ ...styles.scoreNum, color: scoreColor(matchResult.score) }}>
                    {matchResult.score}%
                  </div>
                  <div style={styles.scoreVerdict}>{matchResult.verdict}</div>
                </div>

                {/* Strengths */}
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>✅ Your Strengths</div>
                  {matchResult.strengths?.map((s, i) => (
                    <div key={i} style={styles.strengthItem}>• {s}</div>
                  ))}
                </div>

                {/* Gaps */}
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>⚠️ Gaps to Address</div>
                  {matchResult.gaps?.map((g, i) => (
                    <div key={i} style={styles.gapItem}>• {g}</div>
                  ))}
                </div>

                {/* Tip */}
                <div style={styles.tipBox}>
                  💡 {matchResult.tip}
                </div>

                <button onClick={() => setMatchResult(null)} style={styles.analyzeBtn}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrap: { flex: 1, display: 'flex', flexDirection: 'column', background: 'white' },
  filterRow: { padding: '10px 20px', borderBottom: '0.5px solid #fff0f5', display: 'flex', alignItems: 'center', gap: 8 },
  filterBtn: { background: '#fff0f5', border: '0.5px solid #ffd6e4', borderRadius: 20, padding: '4px 14px', fontSize: 11, color: '#e57fa0', cursor: 'pointer' },
  filterActive: { background: '#ff80ab', color: 'white', borderColor: '#ff80ab' },
  search: { marginLeft: 'auto', background: 'white', border: '0.5px solid #ddd', borderRadius: 8, padding: '5px 10px', fontSize: 11, color: '#2d2d2d', width: 100, outline: 'none' },
  tableWrap: { flex: 1, overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#fff8fb' },
  th: { fontSize: 10, color: '#e57fa0', fontWeight: 500, padding: '10px 16px', borderBottom: '0.5px solid #ffd6e4', textAlign: 'left', whiteSpace: 'nowrap' },
  row: { borderBottom: '0.5px solid #fff0f5' },
  td: { fontSize: 11, color: '#2d2d2d', padding: '12px 16px', verticalAlign: 'middle' },
  company: { display: 'flex', alignItems: 'center', gap: 8 },
  companyDot: { width: 30, height: 30, borderRadius: 8, background: '#fff0f5', border: '0.5px solid #ffd6e4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#e91e8c', flexShrink: 0 },
  resumeBtn: { display: 'flex', alignItems: 'center', gap: 6, background: '#fff0f5', border: '0.5px solid #ffc1d4', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' },
  pdfIcon: { width: 22, height: 26, background: '#e91e8c', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 600, color: 'white', flexShrink: 0 },
  resumeName: { fontSize: 10, color: '#c2185b', fontWeight: 500 },
  resumeSub: { fontSize: 9, color: '#e57fa0' },
  dlArrow: { fontSize: 12, color: '#e91e8c', marginLeft: 2 },
  statusBadge: { borderRadius: 20, padding: '3px 10px', fontSize: 10, fontWeight: 500, border: 'none', cursor: 'pointer' },
  matchBtn: { background: '#fff0f5', border: '0.5px solid #ffd6e4', borderRadius: 6, padding: '5px 10px', fontSize: 10, color: '#e91e8c', cursor: 'pointer' },
  deleteBtn: { background: 'none', border: '0.5px solid #ffd6e4', borderRadius: 6, padding: '5px 10px', fontSize: 10, color: '#e91e8c', cursor: 'pointer' },
  empty: { textAlign: 'center', padding: 40, color: '#e57fa0', fontSize: 13 },
  footer: { padding: '10px 20px', borderTop: '0.5px solid #fff0f5', fontSize: 10, color: '#e57fa0' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: 'white', borderRadius: 16, width: 520, maxWidth: '90%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(255,128,171,0.3)' },
  modalHeader: { padding: '16px 20px', borderBottom: '0.5px solid #fff0f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'white' },
  modalTitle: { fontSize: 15, fontWeight: 600, color: '#c2185b' },
  closeBtn: { background: 'none', border: 'none', fontSize: 16, color: '#e57fa0', cursor: 'pointer' },
  modalBody: { padding: 20, display: 'flex', flexDirection: 'column', gap: 14 },
  modalSub: { fontSize: 12, color: '#e57fa0' },
  textarea: { width: '100%', height: 160, background: '#fff8fb', border: '0.5px solid #ffd6e4', borderRadius: 8, padding: 12, fontSize: 12, color: '#2d2d2d', outline: 'none', resize: 'vertical', fontFamily: 'sans-serif' },
  analyzeBtn: { background: '#ff80ab', color: 'white', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, cursor: 'pointer', fontWeight: 600 },
  scoreBox: { background: '#fff0f5', borderRadius: 12, padding: '20px', textAlign: 'center' },
  scoreNum: { fontSize: 48, fontWeight: 700 },
  scoreVerdict: { fontSize: 14, color: '#e57fa0', marginTop: 4, fontWeight: 500 },
  section: { display: 'flex', flexDirection: 'column', gap: 6 },
  sectionTitle: { fontSize: 12, fontWeight: 600, color: '#c2185b', marginBottom: 4 },
  strengthItem: { fontSize: 12, color: '#2e7d32', background: '#e8f5e9', borderRadius: 6, padding: '6px 10px' },
  gapItem: { fontSize: 12, color: '#e65100', background: '#fff8e1', borderRadius: 6, padding: '6px 10px' },
  tipBox: { background: '#fff0f5', border: '0.5px solid #ffd6e4', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#c2185b', fontStyle: 'italic' },
}