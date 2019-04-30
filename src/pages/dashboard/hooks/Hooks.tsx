import React from 'react'
import http from '../../../util/http'

interface Props {}
interface State {
  next: boolean
  data: any[]
  createCommand: string
  createDescription: string
  createAuthentication: string
}

class Hooks extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      next: false,
      data: [],
      createCommand: '',
      createDescription: '',
      createAuthentication: '0'
    }
  }

  componentDidMount(): void {
    http.get('/api/hooks')
        .then(res => {
          this.setState({
            next: res.data.data.next,
            data: res.data.data.items
          })
        })
  }

  createHook = () => {
    http.post('/api/hooks', {
      command: this.state.createCommand,
      description: this.state.createDescription,
      auth: this.state.createAuthentication === '0'
    }).then(res => {
      if (res.status === 200) {
        this.setState({
          createCommand: '',
          createDescription: '',
          createAuthentication: '0'
        })
      }
    })
  }

  render() {
    return (
        <div>
          <div className="container-fluid">
            <div className="row">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <button type="button" className="btn btn-success btn-sm"
                          data-toggle="modal" data-target="#add_hook">
                    <i className="fa fa-plus"></i>&nbsp;Add Hook
                  </button>
                  <button type="button"
                          className="btn btn-danger btn-sm"
                          style={{marginLeft: 10}}
                          data-toggle="modal" data-target="#add_hook">
                    <i className="fa fa-trash"></i>&nbsp;Clear All
                  </button>
                </div>
                <div className="panel-body" style={{overflowX: 'scroll'}}>
                  {
                    this.state.data.length === 0 ? <span>There are no hooks yet...</span> :
                        <table className="table table-bordered table-striped table-hover">
                          <thead>
                            <tr>
                              <th>Path</th>
                              <th>Command</th>
                              <th>Description</th>
                              <th>Authentication</th>
                              <th>Update Time</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.state.data.map(item =>
                                  <tr>
                                    <td><code>/hooks/{item.uuid}</code></td>
                                    <td><code>{item.command}</code></td>
                                    <td>{item.description}</td>
                                    <td>{item.auth ? <i className="fa fa-check"></i> : <i className="fa fa-times"></i>}</td>
                                    <td>{item.updateTime}</td>
                                    <td>
                                      <button className="btn btn-xs btn-danger"><i className="fa fa-trash"></i> Delete</button>
                                      <button className="btn btn-xs btn-warning" style={{marginLeft: 5}}>
                                        <i className="fa fa-edit"></i> Edit
                                      </button>
                                    </td>
                                  </tr>
                              )
                            }
                          </tbody>
                        </table>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="add_hook" role="dialog"
               aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal"
                          aria-label="Close"><span
                      aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title" id="myModalLabel"><i className="fa fa-lightbulb"></i> Add a Hook</h4>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Shell command</label>
                    <textarea className="form-control"
                              value={this.state.createCommand}
                              onChange={e => this.setState({ createCommand: e.target.value })}/>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-control"
                              value={this.state.createDescription}
                              onChange={e => this.setState({ createDescription: e.target.value })}/>
                  </div>
                  <div className="form-group">
                    <label>Authentication</label>
                    <select className="form-control"
                            onChange={e => this.setState({ createAuthentication: e.target.value })}>
                      <option value="0" selected={this.state.createAuthentication === '0'}>Use access key</option>
                      <option value="1" selected={this.state.createAuthentication === '1'}>Do not use any key</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-sm btn-default" data-dismiss="modal"><i className="fa fa-times"></i> Cancel</button>
                  <button className="btn btn-sm btn-primary" data-dismiss="modal" onClick={this.createHook}>
                    <i className="fa fa-save"></i> Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default Hooks
