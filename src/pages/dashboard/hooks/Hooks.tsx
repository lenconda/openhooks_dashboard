import React from 'react'
import http from '../../../util/http'
import Pagination from '../../../components/Pagination'

interface Props {
  match: any
}
interface State {
  next: boolean
  data: any[]
  currentPage: number
  pages: number
  createCommand: string
  createDescription: string
  createAuthentication: string
  editUuid: string
  editCommand: string
  editDescription: string
  editAuthentication: string
}

class Hooks extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      currentPage: 1,
      pages: 1,
      next: false,
      data: [],
      createCommand: '',
      createDescription: '',
      createAuthentication: '1',
      editUuid: '',
      editCommand: '',
      editDescription: '',
      editAuthentication: ''
    }
  }

  componentDidMount(): void {
    this.getHooks(this.props.match.params.page)
  }

  componentWillReceiveProps(
      nextProps: Readonly<Props>, nextContext: any): void {
    this.setState({
      currentPage: parseInt(nextProps.match.params.page)
    })
    this.getHooks(nextProps.match.params.page)
  }

  getHooks = (page: number) => {
    http.get(`/api/hooks?page=${page}`)
    .then(res => {
      this.setState({
        next: res.data.data.next,
        data: res.data.data.items,
        pages: res.data.data.pages
      })
    })
  }

  handleEditHook = (item: any) => {
    this.setState({
      editUuid: item.uuid,
      editCommand: item.command,
      editDescription: item.description,
      editAuthentication: item.auth ? '0' : '1'
    })
  }

  clearEditHook = () => {
    this.setState({
      editUuid: '',
      editCommand: '',
      editDescription: '',
      editAuthentication: ''
    })
  }

  updateHook = () => {
    http.put(`/api/hook/${this.state.editUuid}`, {
      updates: {
        command: this.state.editCommand,
        description: this.state.editDescription,
        auth: this.state.editAuthentication === '0'
      }
    })
    .then(res => {
      this.getHooks(this.state.currentPage)
      this.clearEditHook()
      // ToastsStore.success(res.data.data)
    })
  }

  createHook = () => {
    http.post('/api/hooks', {
      command: this.state.createCommand,
      description: this.state.createDescription,
      auth: this.state.createAuthentication === '0'
    }).then(res => {
      if (res.status === 200) {
        this.getHooks(this.props.match.params.page)
        this.setState({
          createCommand: '',
          createDescription: '',
          createAuthentication: '0'
        })
        // ToastsStore.success(res.data.data)
      }
    })
  }

  deleteHook = (uuid: string) => {
    if (window.confirm(`Sure to delete hook /hooks/${uuid}?`))
      http.delete(`/api/hook/${uuid}`)
        .then(res => {
          this.getHooks(this.state.currentPage)
          // ToastsStore.success(res.data.data)
        })
  }

  clearHooks = () => {
    if (window.confirm(`Sure to CLEAR ALL hooks?`))
      http.delete('/api/hooks')
      .then(res => {
        this.getHooks(this.state.currentPage)
        // ToastsStore.success(res.data.data)
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
                          onClick={this.clearHooks}>
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
                              this.state.data.map((item, index) =>
                                  <tr key={index}>
                                    <td><code>/hooks/{item.uuid}</code></td>
                                    <td><code>{item.command}</code></td>
                                    <td>{item.description}</td>
                                    <td style={{textAlign: 'center'}}>
                                      {item.auth ? <i className="fa fa-check"></i> : <i className="fa fa-times"></i>}
                                    </td>
                                    <td>{item.updateTime}</td>
                                    <td>
                                      <button className="btn btn-xs btn-danger"
                                              onClick={() => {this.deleteHook(item.uuid)}}>
                                        <i className="fa fa-trash"></i> Delete
                                      </button>
                                      <button type="button"
                                              className="btn btn-xs btn-warning"
                                              data-toggle="modal"
                                              data-target="#edit_hook"
                                              style={{marginLeft: 5}}
                                              onClick={() => this.handleEditHook(item)}>
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
                {
                  this.state.data.length === 0 ? null :
                      <div className="panel-footer">
                        <Pagination current={this.state.currentPage} total={this.state.pages} route="/dashboard/hooks" />
                      </div>
                }
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
                  <button
                      className="btn btn-sm btn-primary"
                      data-dismiss="modal"
                      onClick={this.createHook}
                      disabled={this.state.createAuthentication === ''
                      || this.state.createDescription === ''
                      || this.state.createCommand === ''}>
                    <i className="fa fa-save"></i> Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="edit_hook" role="dialog"
               aria-labelledby="myModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal"
                          aria-label="Close"><span
                      aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title" id="myModalLabel">
                    <i className="fa fa-edit"></i> Edit Hook {this.state.editUuid}
                  </h4>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Shell command</label>
                    <textarea className="form-control"
                              value={this.state.editCommand}
                              onChange={e => this.setState({ editCommand: e.target.value })}/>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-control"
                              value={this.state.editDescription}
                              onChange={e => this.setState({ editDescription: e.target.value })}/>
                  </div>
                  <div className="form-group">
                    <label>Authentication</label>
                    <select className="form-control"
                            onChange={e => this.setState({ editAuthentication: e.target.value })}>
                      <option value="0" selected={this.state.editAuthentication === '0'}>Use access key</option>
                      <option value="1" selected={this.state.editAuthentication === '1'}>Do not use any key</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-sm btn-default" data-dismiss="modal" onClick={this.clearEditHook}>
                    <i className="fa fa-times"></i> Cancel
                  </button>
                  <button
                      className="btn btn-sm btn-primary"
                      data-dismiss="modal"
                      onClick={this.updateHook}
                      disabled={this.state.editAuthentication === ''
                      || this.state.editAuthentication === ''
                      || this.state.editAuthentication === ''}>
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

export default Hooks
