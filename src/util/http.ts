import axios from 'axios'
import { history } from '../App'

axios.defaults.timeout = 3600000
axios.interceptors.request.use(config => {
  config.headers = { Authorization: `${localStorage.getItem('token')}`}
  return config
})
axios.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response.status === 401) {
    localStorage.removeItem('token')
    alert('Login to the dashboard, please')
    history.push('/login')
  }
})

export default axios
