import React from 'react'

interface State {
  show: boolean
}
interface Props {
  show: boolean
  handleClose: (show: boolean) => any
}

class Alert extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      show: false
    }
  }

  render() {
    return (
        this.props.show ?
            <div className="container">
              <div className="alert alert-warning alert-dismissible fade in" role="alert">
                <button type="button" className="close" onClick={() => this.props.handleClose(false)}>
                  <span aria-hidden="true">×</span>
                </button>
                <strong>Holy guacamole!</strong> Best check yo self, you're not
                looking too good.
              </div>
            </div> : null
    )
  }
}

export default Alert
