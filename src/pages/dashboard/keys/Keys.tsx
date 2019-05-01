import React from 'react'
import http from '../../../util/http'
import Pagination from '../../../components/Pagination'
import { getFormattedTime } from '../../../util/time'

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
  showSuccessAlert: boolean
}

class Keys extends React.Component<Props, State> {
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
      editAuthentication: '',
      showSuccessAlert: false
    }
  }

  componentDidMount(): void {
    this.getKeys(this.props.match.params.page)
  }

  componentWillReceiveProps(
      nextProps: Readonly<Props>, nextContext: any): void {
    this.setState({
      currentPage: parseInt(nextProps.match.params.page)
    })
    this.getKeys(nextProps.match.params.page)
  }

  getKeys = (page: number) => {
    http.get(`/api/keys?page=${page}`)
    .then(res => {
      if (res)
        this.setState({
          next: res.data.data.next,
          data: res.data.data.items,
          pages: res.data.data.pages
        })
    })
  }

  generateKey = () => {
    http.post('/api/keys', {}).then(res => {
      if (res)
        this.getKeys(this.props.match.params.page)
    })
  }

  deleteKey = (key: string) => {
    if (window.confirm(`Sure to delete key ${key}?`))
      http.delete(`/api/key/${key}`)
        .then(res => {
          if (res)
            this.getKeys(this.state.currentPage)
        })
  }

  clearKeys = () => {
    if (window.confirm(`Sure to CLEAR ALL keys?`))
      http.delete('/api/keys')
      .then(res => {
        if (res)
          this.getKeys(this.state.currentPage)
      })
  }

  render() {
    return (
        <div>
          <div className="container-fluid">
            <div className="row">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <button type="button"
                          onClick={this.generateKey}
                          className="btn btn-success btn-sm">
                    <i className="fa fa-plus"></i>&nbsp;Generate Key
                  </button>
                  <button type="button"
                          className="btn btn-danger btn-sm"
                          style={{marginLeft: 10}}
                          onClick={this.clearKeys}>
                    <i className="fa fa-trash"></i>&nbsp;Clear All
                  </button>
                </div>
                <div className="panel-body" style={{overflowX: 'scroll'}}>
                  {
                    this.state.data.length === 0 ? <span>There are no keys yet...</span> :
                        <table className="table table-bordered table-striped table-hover">
                          <thead>
                            <tr>
                              <th>Key</th>
                              <th>Create Time</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.state.data.map((item, index) =>
                                  <tr key={index}>
                                    <td><code>{item.value}</code></td>
                                    <td>{getFormattedTime(item.createTime)}</td>
                                    <td>
                                      <button className="btn btn-xs btn-danger"
                                              onClick={() => {this.deleteKey(item.value)}}>
                                        <i className="fa fa-trash"></i> Delete
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
                        <Pagination current={this.state.currentPage} total={this.state.pages} route="/dashboard/keys"/>
                      </div>
                }
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default Keys
