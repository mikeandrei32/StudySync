function Dashboard() {
  // TODO: Connect to backend API for real data
  const stats = {
    subjects: 5,
    pendingTasks: 8,
    completedTasks: 12,
    studyHours: 24
  }

  const recentTasks = [
    { id: 1, title: 'Database Systems Quiz', subject: 'CS 201', dueDate: 'April 26', priority: 'High' },
    { id: 2, title: 'Math Assignment 5', subject: 'MATH 101', dueDate: 'April 27', priority: 'Medium' },
    { id: 3, title: 'Physics Lab Report', subject: 'PHYS 101', dueDate: 'April 28', priority: 'Low' }
  ]

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="logo">StudySync AI</div>
        <div className="nav-links">
          <a href="#" className="active">Dashboard</a>
          <a href="#">Subjects</a>
          <a href="#">Tasks</a>
          <a href="#">Planner</a>
          <a href="#">Timer</a>
          <a href="#">Notes</a>
        </div>
        <div className="user-menu">
          <span>John Doe</span>
          <button className="btn btn-outline">Logout</button>
        </div>
      </nav>

      <main className="dashboard-content">
        <h1>Welcome back, John! 👋</h1>
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
            <h3>Study Hours</h3>
            <p className="stat-value">{stats.studyHours}h</p>
          </div>
        </div>

        <div className="dashboard-sections">
          <section className="card">
            <h2>Pending Assignments</h2>
            <div className="task-list">
              {recentTasks.map(task => (
                <div key={task.id} className="task-item">
                  <div className="task-info">
                    <h4>{task.title}</h4>
                    <p>{task.subject} • Due {task.dueDate}</p>
                  </div>
                  <span className={`priority priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn">+ Add Task</button>
              <button className="action-btn">+ Add Subject</button>
              <button className="action-btn">⏱️ Start Focus</button>
              <button className="action-btn">📝 Add Note</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Dashboard