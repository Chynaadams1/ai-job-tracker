import { useState, useEffect } from 'react'
import { getJobs, deleteJob } from '../api/jobs'
import JobTable from '../components/JobTable'
import AddJobModal from '../components/AddJobModal'

export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    const res = await getJobs()
    setJobs(res.data)
  }

  const handleDelete = async (id) => {
    await deleteJob(id)
    fetchJobs()
  }

  const filtered = filter === 'all' 
    ? jobs 
    : jobs.filter(j => j.status === filter)

  const stats = {
    total: jobs.length,
    interviews: jobs.filter(j => j.status === 'interview').length,
    offers: jobs.filter(j => j.status === 'offer').length,
    pending: jobs.filter(j => j.status === 'applied').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
  }

  return (
    <div style={styles.app}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          🎀 CareerKit
        </div>
        <div style={styles.divider} />
        {['all','applied','interview','offer','rejected'].map(s => (
          <div
            key={s}
            onClick={() => setFilter(s)}
            style={{
              ...styles.navItem,
              ...(filter === s ? styles.navActive : {})
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span style={{
              ...styles.navCount,
              ...(filter === s ? styles.navCountActive : {})
            }}>
              {s === 'all' ? jobs.length : jobs.filter(j => j.status === s).length}
            </span>
          </div>
        ))}
        <div style={styles.sidebarBottom}>
          <div style={styles.avatar}>CA</div>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {/* Top bar */}
        <div style={styles.topbar}>
          <div>
            <div style={styles.pageTitle}>🎀 Job Applications</div>
            <div style={styles.pageSub}>
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · {jobs.length} total
            </div>
          </div>
          <button onClick={() => setShowModal(true)} style={styles.addBtn}>
            + Add New
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          {[
            { label: 'Total Applied', value: stats.total, pct: 100 },
            { label: 'Interviews', value: stats.interviews, pct: stats.total ? (stats.interviews/stats.total)*100 : 0 },
            { label: 'Offers', value: stats.offers, pct: stats.total ? (stats.offers/stats.total)*100 : 0 },
            { label: 'Pending', value: stats.pending, pct: stats.total ? (stats.pending/stats.total)*100 : 0 },
            { label: 'Rejected', value: stats.rejected, pct: stats.total ? (stats.rejected/stats.total)*100 : 0 },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statNum}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
              <div style={styles.statBar}>
                <div style={{ ...styles.statFill, width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <JobTable
          jobs={filtered}
          filter={filter}
          setFilter={setFilter}
          onDelete={handleDelete}
          onRefresh={fetchJobs}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <AddJobModal
          onClose={() => setShowModal(false)}
          onSave={() => { fetchJobs(); setShowModal(false) }}
        />
      )}
    </div>
  )
}

const styles = {
  app: { display: 'flex', minHeight: '100vh', background: '#fff0f5', fontFamily: 'sans-serif' },
  sidebar: { width: 180, background: '#ff80ab', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 6 },
  logo: { fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 12 },
  divider: { height: 1, background: '#ffe0ed', marginBottom: 6 },
  navItem: { padding: '8px 12px', borderRadius: 20, fontSize: 12, color: '#ffe0ed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navActive: { background: 'white', color: '#c2185b', fontWeight: 600 },
  navCount: { background: '#ffe0ed', color: '#c2185b', borderRadius: 20, padding: '1px 7px', fontSize: 10 },
  navCountActive: { background: '#fff0f5' },
  sidebarBottom: { marginTop: 'auto' },
  avatar: { width: 32, height: 32, borderRadius: '50%', background: '#e91e8c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'white' },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  topbar: { padding: '16px 20px', background: 'white', borderBottom: '0.5px solid #fff0f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  pageTitle: { fontSize: 18, fontWeight: 600, color: '#c2185b' },
  pageSub: { fontSize: 11, color: '#e57fa0', marginTop: 2 },
  addBtn: { background: '#ff80ab', color: 'white', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 12, cursor: 'pointer' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', background: 'white', borderBottom: '0.5px solid #fff0f5' },
  statCard: { padding: '14px 16px', borderRight: '0.5px solid #fff0f5' },
  statNum: { fontSize: 22, fontWeight: 600, color: '#e91e8c' },
  statLabel: { fontSize: 10, color: '#e57fa0', marginTop: 1 },
  statBar: { height: 2, background: '#ffe0ed', borderRadius: 2, marginTop: 8 },
  statFill: { height: '100%', borderRadius: 2, background: '#ff80ab' },
}