import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { studyPlansAPI, subjectsAPI } from '../services/api'

function Planner() {
  const [plans, setPlans] = useState([])
  const [subjects, setSubjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [view, setView] = useState('week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    date: '',
    startTime: '',
    endTime: ''
  })

  useEffect(() => {
    loadPlans()
    loadSubjects()
  }, [currentDate, view])

  const loadPlans = async () => {
    try {
      const startDate = getDateRange().start
      const endDate = getDateRange().end
      const data = await studyPlansAPI.getAll({ startDate, endDate })
      setPlans(data)
    } catch (error) {
      console.error('Error loading study plans:', error)
    }
  }

  const loadSubjects = async () => {
    try {
      const data = await subjectsAPI.getAll()
      setSubjects(data)
    } catch (error) {
      console.error('Error loading subjects:', error)
    }
  }

  const getDateRange = () => {
    const start = new Date(currentDate)
    const end = new Date(currentDate)
    
    if (view === 'week') {
      start.setDate(start.getDate() - start.getDay())
      end.setDate(start.getDate() + 6)
    } else if (view === 'month') {
      start.setDate(1)
      end.setMonth(end.getMonth() + 1, 0)
    }
    
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    }
  }

  const getDaysInView = () => {
    const days = []
    const start = new Date(currentDate)
    start.setDate(start.getDate() - start.getDay())
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      days.push(day)
    }
    return days
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPlan) {
        await studyPlansAPI.update(editingPlan._id, formData)
      } else {
        await studyPlansAPI.create(formData)
      }
      setFormData({ title: '', description: '', subject: '', date: '', startTime: '', endTime: '' })
      setShowForm(false)
      setEditingPlan(null)
      loadPlans()
    } catch (error) {
      console.error('Error saving study plan:', error)
    }
  }

  const handleComplete = async (id) => {
    try {
      await studyPlansAPI.complete(id)
      loadPlans()
    } catch (error) {
      console.error('Error completing study plan:', error)
    }
  }

  const handleEdit = (plan) => {
    setEditingPlan(plan)
    setFormData({
      title: plan.title,
      description: plan.description || '',
      subject: plan.subject?._id || '',
      date: plan.date.split('T')[0],
      startTime: plan.startTime,
      endTime: plan.endTime
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this study plan?')) {
      try {
        await studyPlansAPI.delete(id)
        loadPlans()
      } catch (error) {
        console.error('Error deleting study plan:', error)
      }
    }
  }

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate)
    if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7))
    } else {
      newDate.setMonth(newDate.getMonth() + direction)
    }
    setCurrentDate(newDate)
  }

  const getPlansForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return plans.filter(plan => plan.date.split('T')[0] === dateStr)
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="page">
      <nav className="page-nav">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>Study Planner</h1>
      </nav>

      <div className="page-content">
        <div className="page-header">
          <p>Plan your study sessions</p>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingPlan(null); setFormData({ title: '', description: '', subject: '', date: new Date().toISOString().split('T')[0], startTime: '09:00', endTime: '10:00' }) }}>
            {showForm ? 'Cancel' : '+ Add Study Plan'}
          </button>
        </div>

        <div className="calendar-nav">
          <button onClick={() => navigateDate(-1)} className="btn btn-outline">← Previous</button>
          <h2>
            {view === 'week' 
              ? `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
              : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            }
          </h2>
          <button onClick={() => navigateDate(1)} className="btn btn-outline">Next →</button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>{editingPlan ? 'Edit Study Plan' : 'Add New Study Plan'}</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Study Goal *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Review Chapter 3 for Database Systems"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}>
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time *</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional notes..."
                  rows={2}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {editingPlan ? 'Update Plan' : 'Add Study Plan'}
              </button>
            </form>
          </div>
        )}

        <div className="calendar-grid">
          {getDaysInView().map((day, index) => {
            const dayPlans = getPlansForDay(day)
            const isToday = day.toDateString() === new Date().toDateString()
            
            return (
              <div key={index} className={`calendar-day ${isToday ? 'today' : ''}`}>
                <div className="day-header">
                  <span className="day-name">{days[day.getDay()]}</span>
                  <span className="day-date">{day.getDate()}</span>
                </div>
                <div className="day-plans">
                  {dayPlans.length === 0 ? (
                    <p className="no-plans">No plans</p>
                  ) : (
                    dayPlans.map(plan => (
                      <div 
                        key={plan._id} 
                        className={`plan-item ${plan.completed ? 'completed' : ''}`}
                        style={{ borderLeftColor: plan.subject?.color || '#4f46e5' }}
                      >
                        <div className="plan-time">{formatTime(plan.startTime)}</div>
                        <div className="plan-title">{plan.title}</div>
                        {plan.subject && <div className="plan-subject">{plan.subject.name}</div>}
                        <div className="plan-actions">
                          {!plan.completed && (
                            <button onClick={() => handleComplete(plan._id)} className="btn btn-tiny">✓</button>
                          )}
                          <button onClick={() => handleEdit(plan)} className="btn btn-tiny">✎</button>
                          <button onClick={() => handleDelete(plan._id)} className="btn btn-tiny">✕</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Planner