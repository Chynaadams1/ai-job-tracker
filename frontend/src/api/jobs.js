import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000'
})

export const getJobs = () => API.get('/jobs')
export const createJob = (job) => API.post('/jobs', job)
export const updateJob = (id, job) => API.put(`/jobs/${id}`, job)
export const deleteJob = (id) => API.delete(`/jobs/${id}`)