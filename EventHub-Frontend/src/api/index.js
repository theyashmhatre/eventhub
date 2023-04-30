import axios from "axios"

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
})

api.interceptors.request.use((request) => {
  if (localStorage.getItem('token')) {
    request.headers = {
      ...request.headers,
      authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }
  return request
})

export default api
