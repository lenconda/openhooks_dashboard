import React from 'react'
import './Login.css'
import http from '../../util/http'
import { history } from '../../App'

interface Props {}
interface State {
  rememberUser: boolean
  username: string
  password: string
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      rememberUser: false
    }
  }

  state: State

  login = () => {
    const { username, password } = this.state
    http.post('/api/login', { username, password })
        .then(res => {
          if (this.state.rememberUser)
            localStorage.setItem('token', res.data.data)
          else
            sessionStorage.setItem('token', res.data.data)
          history.push('/dashboard/hooks')
        })
  }

  render() {
    return (
        <div className="container">
          <div className="row login">
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="input-group input-group-sm">
                    <span className="input-group-addon" id="sizing-addon3">
                      <i className="fa fa-user-circle"></i>
                    </span>
                    <input type="text" className="form-control" placeholder="Username"
                           value={this.state.username}
                           onChange={e => this.setState({ username: e.target.value })}/>
                  </div>
                  <div className="input-group input-group-sm">
                    <span className="input-group-addon" id="sizing-addon3">
                      <i className="fa fa-key"></i>
                    </span>
                    <input type="password" className="form-control" placeholder="Password"
                           value={this.state.password}
                           onChange={e => this.setState({ password: e.target.value })}/>
                  </div>
                  <div className="input-group">
                    <label>
                      <input type="checkbox"
                             checked={this.state.rememberUser}
                             onChange={e => this.setState({ rememberUser: !this.state.rememberUser })}/>&nbsp;
                      Remember user
                    </label>
                  </div>
                  <div className="input-group">
                    <button className="btn btn-sm btn-success" onClick={this.login}>
                      <i className="fa fa-sign-in-alt"></i>&nbsp;
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default Login
