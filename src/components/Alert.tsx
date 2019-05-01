import React from 'react'

interface State {}
interface Props {
  duration: number
  type: string
  show: boolean
  handleClose: (show: boolean) => any
}

class Alert extends React.Component<Props, State> {
  private duration: any

  static defaultProps = {
    duration: 10000
  }

  handleDuration = () => {
    if (this.props.duration > 0 || !this.props.duration)
      return setTimeout(() => {
        this.props.handleClose(false) }, this.props.duration)
  }

  handleClose = () => {
    this.props.handleClose(false)
    clearTimeout(this.duration)
  }

  componentWillReceiveProps(
      nextProps: Readonly<Props>, nextContext: any): void {
    if (nextProps.show)
      this.duration = this.handleDuration()
  }

  render() {
    return (
        this.props.show ?
            <div className="container">
              <div className={`alert alert-${this.props.type} alert-dismissible fade in`} role="alert">
                <button type="button" className="close" onClick={this.handleClose}>
                  <span aria-hidden="true">×</span>
                </button>
                {this.props.children}
              </div>
            </div> : null
    )
  }
}

export default Alert
