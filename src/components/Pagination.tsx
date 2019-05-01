import React from 'react'

import { history } from '../App'

interface State {}
interface Props {
  route: string
  current: number
  total: number
}

class Pagination extends React.Component<Props, State> {
  componentWillReceiveProps(
      nextProps: Readonly<Props>, nextContext: any): void {
    console.log(nextProps)
  }

  handleHrefChange = (page: number) => {
    history.push(`${this.props.route}/${page}/`)
  }

  getPages = (): number[] => {
    let pages = []
    const current = this.props.current
    const left = current - 1
    const right = this.props.total - current
    if (left >= 2 && right >= 2)
      for (let i = current - 2; i <= current + 2; i++)
        pages.push(i)
    else if (left < 2 && right >= 2) {
      const last = this.props.total > 5 ? 5 : this.props.total
      for (let i = 1; i <= last; i++)
        pages.push(i)
    }
    else if (right < 2 && left >= 2) {
      const first = this.props.total > 5 ? this.props.total - 4 : 1
      for (let i = first; i <= this.props.total; i++)
        pages.push(i)
    } else
      for (let i = 1; i <= this.props.total; i++)
        pages.push(i)
    return pages
  }

  render() {
    return (
        <nav>
          <ul className="pagination">
            <li>
              <button disabled={this.props.current === 1} onClick={() => this.handleHrefChange(1)}>
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            <li>
              <button disabled={this.props.current === 1} onClick={() => this.handleHrefChange(this.props.current - 1)}>
                <span aria-hidden="true">&lsaquo;</span>
              </button>
            </li>
            {
              this.props.total <= 10 || this.getPages()[0] === 1 ? null : <li><button disabled>...</button></li>
            }
            {
              this.getPages().map((value, index) =>
                  <li key={index}>
                    <button className={this.props.current === value ? 'active' : ''} onClick={() => this.handleHrefChange(value)}>{value}</button>
                  </li>
              )
            }
            {
              this.props.total <= 10 || this.getPages().pop() === this.props.total
                  ? null : <li><button disabled>...</button></li>
            }
            <li>
              <button disabled={this.props.current === this.props.total}
                      onClick={() => this.handleHrefChange(this.props.current + 1)}>
                <span aria-hidden="true">&rsaquo;</span>
              </button>
            </li>
            <li>
              <button disabled={this.props.current === this.props.total}
                      onClick={() => this.handleHrefChange(this.props.total)}>
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
    )
  }
}

export default Pagination
