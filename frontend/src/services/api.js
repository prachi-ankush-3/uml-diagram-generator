import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Normalize errors into a friendly message the UI can show directly.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Something went wrong. Please try again.'
    if (error.response) {
      message = error.response.data?.detail || error.response.data?.message || message
    } else if (error.request) {
      message = 'Unable to reach the server. Is the backend running?'
    }
    return Promise.reject({ ...error, friendlyMessage: message })
  }
)

export const diagramTypes = [
  { value: 'class', label: 'Class Diagram' },
  { value: 'usecase', label: 'Use Case Diagram' },
  { value: 'sequence', label: 'Sequence Diagram' },
  { value: 'activity', label: 'Activity Diagram' },
  { value: 'component', label: 'Component Diagram' },
  { value: 'state', label: 'State Diagram' },
]

export const diagramApi = {
  generate: (payload) => api.post('/api/diagrams/generate', payload).then((r) => r.data),
  validate: (mermaid_code) => api.post('/api/diagrams/validate', { mermaid_code }).then((r) => r.data),
  save: (payload) => api.post('/api/diagrams', payload).then((r) => r.data),
  getAll: () => api.get('/api/diagrams').then((r) => r.data),
  getOne: (id) => api.get(`/api/diagrams/${id}`).then((r) => r.data),
  update: (id, payload) => api.put(`/api/diagrams/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/api/diagrams/${id}`).then((r) => r.data),
  health: () => api.get('/api/health').then((r) => r.data),
}

export default api
