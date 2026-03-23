import { useState } from 'react'
import { createJob } from '../api/jobs'

export default function AddJobModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    company: '',
    job_title: '',
    status: 'applied',
    job_url: '',
    salary: '',
    notes: '',
    resume_submitted: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.company || !form.job_title) {
      alert('Company and Job Title are required!')
      return
    }
    await createJob(form)
    onSave()
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.title}>🎀 Add New Application</div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.body}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Company *</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Job Title *</label>
              <input
                name="job_title"
                value={form.job_title}
                onChange={handleChange}
                placeholder="e.g. Backend Engineer"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Salary</label>
              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. $120,000"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Job URL</label>
            <input
              name="job_url"
              value={form.job_url}
              onChange={handleChange}
              placeholder="e.g. https://careers.google.com"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Resume Submitted</label>
            <input
              name="resume_submitted"
              value={form.resume_submitted}
              onChange={handleChange}
              placeholder="e.g. Resume_v3.pdf"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any notes about this application..."
              style={{ ...styles.input, height: 80, resize: 'none' }}
            />
          </div>
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSubmit} style={styles.saveBtn}>Save Application</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: 'white', borderRadius: 16, width: 540, maxWidth: '90%', boxShadow: '0 20px 60px rgba(255,128,171,0.3)' },
  header: { padding: '16px 20px', borderBottom: '0.5px solid #fff0f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: 600, color: '#c2185b' },
  closeBtn: { background: 'none', border: 'none', fontSize: 16, color: '#e57fa0', cursor: 'pointer' },
  body: { padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: 11, color: '#e57fa0', fontWeight: 500 },
  input: { background: '#fff8fb', border: '0.5px solid #ffd6e4', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#2d2d2d', outline: 'none', width: '100%' },
  footer: { padding: '14px 20px', borderTop: '0.5px solid #fff0f5', display: 'flex', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { background: 'none', border: '0.5px solid #ffd6e4', borderRadius: 8, padding: '8px 16px', fontSize: 12, color: '#e57fa0', cursor: 'pointer' },
  saveBtn: { background: '#ff80ab', color: 'white', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 12, cursor: 'pointer' },
}