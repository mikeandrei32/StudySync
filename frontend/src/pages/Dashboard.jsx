import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { subjectsAPI, tasksAPI, studyPlansAPI } from '../services/api'

function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    subjects: 0,
    pendingTasks: 0,
    completedTasks: 0,
    studyHours: 0
  })
  const [recentTasks, setRecentTasks] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }

      // Load all data in parallel
      const [subjects, tasks, plans] = await Promise.all([
        subjectsAPI.getAll().catch(() => []),
        tasksAPI.getAll().catch(() => []),
        studyPlansAPI.getAll().catch(() => [])
      ])

      // Calculate stats
      const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length
      const completedTasks = tasks.filter(t => t.status === 'completed').length

      setStats({
        subjects: subjects.length,
        pendingTasks,
        completedTasks,
        studyHours: plans.filter(p => p.completed).length
      })

      // Get upcoming tasks (next 7 days)
      const upcomingTasks = tasks
        .filter(t => t.status !== 'completed' && t.deadline)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5)

      setRecentTasks(upcomingTasks)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <Link to="/dashboard" className="logo">StudySync AI</Link>
        <div className="nav-links">
          <Link to="/dashboard" className="active">Dashboard</Link>
          <Link to="/subjects">Subjects</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/planner">Planner</Link>
        </div>
        <div className="user-menu">
          <span>{user?.name || 'Student'}</span>
          <button onClick={handleLogout} className="btn btn-outline">Logout</button>
        </div>
      </nav>

      <main className="dashboard-content">
        <h1>Welcome back, {user?.name || 'Student'}! 👋</h1>
        <p className="subtitle">Here's your academic overview</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Subjects</h3>
            <p className="stat-value">{stats.subjects}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Tasks</h3>
            <p className="stat-value">{stats.pendingTasks}</p>
          </div>
          <div className="stat-card">
            <h3>Completed Tasks</h3>
            <p className="stat-value">{stats.completedTasks}</p>
          </div>
          <div className="stat-card">
            <h3>Study Sessions</h3>
            <p className="stat-value">{stats.studyHours}h</p>
          </div>
        </div>

        <div className="dashboard-sections">
          <section className="card">
            <h2>Upcoming Deadlines</h2>
            {loading ? (
              <p>Loading...</p>
            ) : recentTasks.length === 0 ? (
              <div className="empty-state">
                <p>No upcoming tasks. Add some tasks to get started!</p>
              </div>
            ) : (
              <div className="task-list">
                {recentTasks.map(task => (
                  <div key={task._id} className="task-item">
                    <div className="task-info">
                      <h4>{task.title}</h4>
                      <p>
                        {task.subject?.name || 'No subject'} • 
                        Due {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                      </p>
                    </div>
                    <span className={`priority priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link to="/tasks" className="btn btn-outline" style={{ marginTop: '1rem' }}>
              View All Tasks →
            </Link>
          </section>

          <section className="card">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/subjects" className="action-btn">+ Add Subject</Link>
              <Link to="/tasks" className="action-btn">+ Add Task</Link>
              <Link to="/planner" className="action-btn">📅 Plan Study</Link>
              <Link to="/tasks" className="action-btn">📝 View Tasks</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Dashboard