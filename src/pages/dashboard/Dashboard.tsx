import React from 'react'
import { Route, Switch, Link, NavLink, Redirect } from 'react-router-dom'
import './Dashboard.css'
import http from '../../util/http'
import { history } from '../../App'

import Hooks from './hooks/Hooks'
import Keys from './keys/Keys'
import Histories from './histories/Histories'
import { ToastsStore } from 'react-toasts'

interface Props {}
interface State {
  username: string
  userId: string
  editUsername: string
  oldPassword: string
  editPassword: string
  retypePassword: string
}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      username: '',
      userId: '',
      editUsername: '',
      oldPassword: '',
      editPassword: '',
      retypePassword: ''
    }
  }

  componentDidMount(): void {
    this.getProfile()
  }

  getProfile = () => {
    http.get('/api/profile')
    .then(res => {
      if (res)
        this.setState({
          username: res.data.data.username,
          editUsername: res.data.data.username,
          userId: res.data.data.uuid
        })
    })
  }

  logout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    history.push('/login')
  }

  updateUsername = () => {
    http.put('/api/profile', {
      updates: {
        username: this.state.editUsername
      }
    })
    .then(res => {
      if (res)
        this.getProfile()
    })
  }

  updatePassword = () => {
    if (this.state.retypePassword === this.state.editPassword)
      http.put('/api/profile', {
        updates: {
          password: this.state.oldPassword,
          newPassword: this.state.editPassword
        }
      })
    else
      ToastsStore.error('New password does not equals to retyped password')
  }

  render() {
    return (
        <div>
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                <button type="button"
                        className="navbar-toggle collapsed"
                        data-toggle="collapse"
                        data-target="#menu"
                        aria-expanded="false">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <Link className="navbar-brand" to={'/dashboard'}>Dashboard</Link>
              </div>
              <div className="collapse navbar-collapse" id="menu">
                <ul className="nav navbar-nav">
                  <li><NavLink activeClassName="menu-active" to="/dashboard/hooks/1/">Hooks</NavLink></li>
                  <li><NavLink activeClassName="menu-active"  to="/dashboard/keys/1/">Keys</NavLink></li>
                  <li><NavLink activeClassName="menu-active"  to="/dashboard/histories/1/">Histories</NavLink></li>
                </ul>
                <ul className="nav navbar-nav navbar-right">
                  <li className="dropdown">
                    <a className="dropdown-toggle"
                       data-toggle="dropdown"
                       role="button"
                       aria-haspopup="true"
                       aria-expanded="false">
                      {this.state.username}
                      <span className="caret"></span>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="dropdown-header">{this.state.username}({this.state.userId})</li>
                      <li>
                        <a role="button" data-toggle="modal" data-target="#update_username">
                          <i className="fa fa-user-circle"></i> Change username
                        </a>
                      </li>
                      <li>
                        <a role="button" data-toggle="modal" data-target="#update_password">
                          <i className="fa fa-key"></i> Change password
                        </a>
                      </li>
                      <li role="separator" className="divider"></li>
                      <li>
                        <a onClick={this.logout}>
                          <i className="fa fa-sign-out-alt"></i> Logout
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <Switch>
            <Route path={'/dashboard/hooks/:page'} component={Hooks}/>
            <Route path={'/dashboard/keys/:page'} component={Keys}/>
            <Route path={'/dashboard/histories/:page'} component={Histories}/>
            <Redirect to={'/dashboard/hooks/1/'}/>
          </Switch>
          <div className="modal fade" id="update_username" role="dialog"
               aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal"
                          aria-label="Close"><span
                      aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title text-ellipsis" id="myModalLabel">
                    <i className="fa fa-user-circle"></i> Rename for {this.state.username}({this.state.userId})
                  </h4>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>New username</label>
                    <input className="form-control"
                              value={this.state.editUsername}
                              onChange={e => this.setState({ editUsername: e.target.value })}/>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-sm btn-default" data-dismiss="modal">
                    <i className="fa fa-times"></i> Cancel
                  </button>
                  <button
                      className="btn btn-sm btn-primary"
                      data-dismiss="modal"
                      onClick={this.updateUsername}
                      disabled={this.state.editUsername === ''}>
                    <i className="fa fa-save"></i> Update
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="update_password" role="dialog"
               aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal"
                          aria-label="Close"><span
                      aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title text-ellipsis" id="myModalLabel">
                    <i className="fa fa-key"></i> Change password
                  </h4>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Old password</label>
                    <input className="form-control"
                           type="password"
                           value={this.state.oldPassword}
                           onChange={e => this.setState({ oldPassword: e.target.value })}/>
                  </div>
                  <div className="form-group">
                    <label>New password</label>
                    <input className="form-control"
                           type="password"
                           value={this.state.editPassword}
                           onChange={e => this.setState({ editPassword: e.target.value })}/>
                  </div>

                  <div className="form-group">
                    <label>Retype password</label>
                    <input className="form-control"
                           type="password"
                           value={this.state.retypePassword}
                           onChange={e => this.setState({ retypePassword: e.target.value })}/>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-sm btn-default" data-dismiss="modal">
                    <i className="fa fa-times"></i> Cancel
                  </button>
                  <button
                      className="btn btn-sm btn-primary"
                      data-dismiss="modal"
                      onClick={this.updatePassword}
                      disabled={this.state.oldPassword === '' || this.state.editPassword === ''}>
                    <i className="fa fa-save"></i> Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default Dashboard
