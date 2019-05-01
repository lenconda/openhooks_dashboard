import axios from 'axios'
import { history } from '../App'
import { ToastsStore } from 'react-toasts'

axios.defaults.timeout = 3600000
axios.interceptors.request.use(config => {
  config.headers = { Authorization: `${localStorage.getItem('token')}`}
  return config
})
axios.interceptors.response.use(response => {
  if (response.data.data &&
      Object.prototype.toString.call(response.data.data) === "[object String]")
    ToastsStore.success(response.data.data)
  return response
}, error => {
  if (error.response.status === 401) {
    localStorage.removeItem('token')
    alert('Login to the dashboard, please')
    history.push('/login')
  } else
    console.log(error)
    ToastsStore.error(error.message)
})

export default axios
