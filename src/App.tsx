import React from 'react'
import './App.css'
import { createHashHistory } from 'history'
import { Route, Router } from 'react-router-dom'
import {
  ToastsContainer,
  ToastsContainerPosition,
  ToastsStore } from 'react-toasts'
import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'

export const history = createHashHistory()

class App extends React.Component {
  render() {
    return (
        <div>
          <Router history={history}>
            <Route path={'/login'} component={Login}/>
            <Route path={'/dashboard'} component={Dashboard}/>
          </Router>
          <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} store={ToastsStore}/>
        </div>
    )
  }
}

export default App
