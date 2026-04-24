const API_URL = '/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Auth API
export const authAPI = {
  register: async (data) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  login: async (data) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  getMe: async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: headers()
    });
    return res.json();
  }
};

// Subjects API
export const subjectsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/subjects`, { headers: headers() });
    return res.json();
  },
  
  create: async (data) => {
    const res = await fetch(`${API_URL}/subjects`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  update: async (id, data) => {
    const res = await fetch(`${API_URL}/subjects/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  delete: async (id) => {
    const res = await fetch(`${API_URL}/subjects/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  }
};

// Tasks API
export const tasksAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_URL}/tasks?${params}`, { headers: headers() });
    return res.json();
  },
  
  create: async (data) => {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  update: async (id, data) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  complete: async (id) => {
    const res = await fetch(`${API_URL}/tasks/${id}/complete`, {
      method: 'PATCH',
      headers: headers()
    });
    return res.json();
  },
  
  delete: async (id) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  }
};

// Study Plans API
export const studyPlansAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_URL}/study-plans?${params}`, { headers: headers() });
    return res.json();
  },
  
  create: async (data) => {
    const res = await fetch(`${API_URL}/study-plans`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  update: async (id, data) => {
    const res = await fetch(`${API_URL}/study-plans/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  complete: async (id) => {
    const res = await fetch(`${API_URL}/study-plans/${id}/complete`, {
      method: 'PATCH',
      headers: headers()
    });
    return res.json();
  },
  
  delete: async (id) => {
    const res = await fetch(`${API_URL}/study-plans/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  }
};