import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { subjectsAPI } from '../services/api'

function Subjects() {
  const [subjects, setSubjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    teacher: '',
    schedule: '',
    description: '',
    color: '#4f46e5'
  })

  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    try {
      const data = await subjectsAPI.getAll()
      setSubjects(data)
    } catch (error) {
      console.error('Error loading subjects:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSubject) {
        await subjectsAPI.update(editingSubject._id, formData)
      } else {
        await subjectsAPI.create(formData)
      }
      setFormData({ name: '', teacher: '', schedule: '', description: '', color: '#4f46e5' })
      setShowForm(false)
      setEditingSubject(null)
      loadSubjects()
    } catch (error) {
      console.error('Error saving subject:', error)
    }
  }

  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      teacher: subject.teacher || '',
      schedule: subject.schedule || '',
      description: subject.description || '',
      color: subject.color || '#4f46e5'
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await subjectsAPI.delete(id)
        loadSubjects()
      } catch (error) {
        console.error('Error deleting subject:', error)
      }
    }
  }

  const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

  return (
    <div className="page">
      <nav className="page-nav">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>Subjects</h1>
      </nav>

      <div className="page-content">
        <div className="page-header">
          <p>Manage your school subjects</p>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingSubject(null); setFormData({ name: '', teacher: '', schedule: '', description: '', color: '#4f46e5' }) }}>
            {showForm ? 'Cancel' : '+ Add Subject'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Subject Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Database Systems"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Teacher/Professor</label>
                  <input
                    type="text"
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                    placeholder="e.g., Dr. Smith"
                  />
                </div>
                <div className="form-group">
                  <label>Schedule</label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    placeholder="e.g., Mon/Wed 10am"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description..."
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Color Tag</label>
                <div className="color-picker">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${formData.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                {editingSubject ? 'Update Subject' : 'Add Subject'}
              </button>
            </form>
          </div>
        )}

        <div className="subjects-grid">
          {subjects.length === 0 ? (
            <div className="empty-state">
              <p>No subjects yet. Add your first subject to get started!</p>
            </div>
          ) : (
            subjects.map(subject => (
              <div key={subject._id} className="subject-card" style={{ borderLeftColor: subject.color }}>
                <div className="subject-header">
                  <div className="subject-color" style={{ backgroundColor: subject.color }} />
                  <h3>{subject.name}</h3>
                </div>
                {subject.teacher && <p className="subject-teacher">👤 {subject.teacher}</p>}
                {subject.schedule && <p className="subject-schedule">📅 {subject.schedule}</p>}
                {subject.description && <p className="subject-description">{subject.description}</p>}
                <div className="subject-actions">
                  <button onClick={() => handleEdit(subject)} className="btn btn-small">Edit</button>
                  <button onClick={() => handleDelete(subject._id)} className="btn btn-small btn-danger">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Subjects