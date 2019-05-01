import React from 'react'
import { Route, Switch, Link, NavLink, Redirect } from 'react-router-dom'
import './Dashboard.css'
import http from '../../util/http'

import Hooks from './hooks/Hooks'
import Keys from './keys/Keys'

interface Props {}
interface State {
  username: string,
  userId: string
}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      username: '',
      userId: ''
    }
  }

  componentDidMount(): void {
    http.get('/api/profile')
        .then(res => {
          this.setState({
            username: res.data.data.username,
            userId: res.data.data.uuid
          })
        })
  }

  render() {
    return (
        <div>
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu" aria-expanded="false">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="#">Dashboard</a>
              </div>
              <div className="collapse navbar-collapse" id="menu">
                <ul className="nav navbar-nav">
                  <li><NavLink activeClassName="menu-active" to="/dashboard/hooks/1/">Hooks</NavLink></li>
                  <li><NavLink activeClassName="menu-active"  to="/dashboard/keys/1/">Keys</NavLink></li>
                  <li><NavLink activeClassName="menu-active"  to="/dashboard/histories/1/">Histories</NavLink></li>
                </ul>
                <ul className="nav navbar-nav navbar-right">
                  <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                      {this.state.username}
                      <span className="caret"></span>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="dropdown-header">{this.state.username}({this.state.userId})</li>
                      <li><a><i className="fa fa-user-circle"></i> Change username</a></li>
                      <li><a><i className="fa fa-key"></i> Change password</a></li>
                      <li role="separator" className="divider"></li>
                      <li><a><i className="fa fa-sign-out-alt"></i> Logout</a></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <Switch>
            <Route path={'/dashboard/hooks/:page'} component={Hooks}/>
            <Route path={'/dashboard/keys/:page'} component={Keys}/>
            <Redirect to={'/dashboard/hooks/1/'}/>
          </Switch>
        </div>
    )
  }
}

export default Dashboard
