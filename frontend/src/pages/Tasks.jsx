import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { tasksAPI, subjectsAPI } from '../services/api'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [subjects, setSubjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState({ status: '', priority: '' })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    priority: 'medium',
    deadline: ''
  })

  useEffect(() => {
    loadTasks()
    loadSubjects()
  }, [filter])

  const loadTasks = async () => {
    try {
      const filters = {}
      if (filter.status) filters.status = filter.status
      if (filter.priority) filters.priority = filter.priority
      const data = await tasksAPI.getAll(filters)
      setTasks(data)
    } catch (error) {
      console.error('Error loading tasks:', error)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const taskData = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined
      }
      if (editingTask) {
        await tasksAPI.update(editingTask._id, taskData)
      } else {
        await tasksAPI.create(taskData)
      }
      setFormData({ title: '', description: '', subject: '', priority: 'medium', deadline: '' })
      setShowForm(false)
      setEditingTask(null)
      loadTasks()
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const handleComplete = async (id) => {
    try {
      await tasksAPI.complete(id)
      loadTasks()
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      subject: task.subject?._id || '',
      priority: task.priority,
      deadline: task.deadline ? task.deadline.split('T')[0] : ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(id)
        loadTasks()
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  const getPriorityClass = (priority) => {
    return `priority-${priority}`
  }

  const getStatusClass = (status) => {
    return `status-${status}`
  }

  return (
    <div className="page">
      <nav className="page-nav">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>Tasks & Assignments</h1>
      </nav>

      <div className="page-content">
        <div className="page-header">
          <p>Track your assignments and deadlines</p>
          <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingTask(null); setFormData({ title: '', description: '', subject: '', priority: 'medium', deadline: '' }) }}>
            {showForm ? 'Cancel' : '+ Add Task'}
          </button>
        </div>

        <div className="filters">
          <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          <select value={filter.priority} onChange={(e) => setFilter({ ...filter, priority: e.target.value })}>
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Database Quiz"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>
                  <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}>
                    <option value="">Select Subject</option>
                    {subjects.map(s => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
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
              <button type="submit" className="btn btn-primary">
                {editingTask ? 'Update Task' : 'Add Task'}
              </button>
            </form>
          </div>
        )}

        <div className="tasks-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Add your first task to get started!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task._id} className={`task-card ${task.status}`}>
                <div className="task-main">
                  <button 
                    className={`checkbox ${task.status === 'completed' ? 'checked' : ''}`}
                    onClick={() => task.status !== 'completed' && handleComplete(task._id)}
                    disabled={task.status === 'completed'}
                  >
                    {task.status === 'completed' && '✓'}
                  </button>
                  <div className="task-content">
                    <h3 className={task.status === 'completed' ? 'completed' : ''}>{task.title}</h3>
                    <div className="task-meta">
                      {task.subject && (
                        <span className="task-subject" style={{ backgroundColor: task.subject.color + '20', color: task.subject.color }}>
                          {task.subject.name}
                        </span>
                      )}
                      {task.deadline && (
                        <span className="task-deadline">📅 {new Date(task.deadline).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="task-actions">
                  <span className={`priority-badge ${getPriorityClass(task.priority)}`}>{task.priority}</span>
                  <span className={`status-badge ${getStatusClass(task.status)}`}>{task.status}</span>
                  <button onClick={() => handleEdit(task)} className="btn btn-small">Edit</button>
                  <button onClick={() => handleDelete(task._id)} className="btn btn-small btn-danger">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Tasks