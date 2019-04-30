import React from 'react'
import './App.css'
import { createHashHistory } from 'history'
import { Link, Route, Router, match } from 'react-router-dom'

import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'

export const history = createHashHistory()

class App extends React.Component {
  render() {
    return (
        <Router history={history}>
          <Route path={'/login'} component={Login}/>
          <Route path={'/dashboard'} component={Dashboard}/>
        </Router>
    )
  }
}

export default App
