import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className="landing">
      <nav className="navbar">
        <div className="logo">StudySync AI</div>
        <div className="nav-links">
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      <header className="hero">
        <h1>Your AI-Powered Study Companion</h1>
        <p className="tagline">
          Manage tasks, track progress, organize notes, and boost productivity — all in one place.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary btn-large">Get Started Free</Link>
          <Link to="/login" className="btn btn-outline btn-large">Sign In</Link>
        </div>
      </header>

      <section className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>📚 Subject Management</h3>
            <p>Organize your courses and subjects in one place</p>
          </div>
          <div className="feature-card">
            <h3>✅ Task Tracker</h3>
            <p>Track assignments and never miss a deadline</p>
          </div>
          <div className="feature-card">
            <h3>📅 Study Planner</h3>
            <p>Plan your study sessions with calendar view</p>
          </div>
          <div className="feature-card">
            <h3>⏱️ Focus Timer</h3>
            <p>Pomodoro-style timer for better concentration</p>
          </div>
          <div className="feature-card">
            <h3>📝 Notes Organizer</h3>
            <p>Store and organize notes by subject</p>
          </div>
          <div className="feature-card">
            <h3>🤖 AI Reviewer</h3>
            <p>Generate smart summaries from your notes</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 StudySync AI. Built for students, by students.</p>
      </footer>
    </div>
  )
}

export default Landing