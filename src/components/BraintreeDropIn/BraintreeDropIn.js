import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import BraintreeWebDropIn from "braintree-web-drop-in"

export default class BraintreeDropIn extends React.Component {
  wrapper
  hostedFieldsInstance

  async componentDidMount() {
    this.instance = await BraintreeWebDropIn.create({
      container: ReactDOM.findDOMNode(this.wrapper),
      ...this.props.options
    })

    if (this.props.onNoPaymentMethodRequestable) {
      this.instance.on(
      	"noPaymentMethodRequestable",
      	this.props.onNoPaymentMethodRequestable
      )
    }
    if (this.props.onPaymentMethodRequestable) {
      this.instance.on(
      	"paymentMethodRequestable",
      	this.props.onPaymentMethodRequestable
      )
    }
    if (this.props.onPaymentOptionSelected) {
      this.instance.on(
      	"paymentOptionSelected",
      	this.props.onPaymentOptionSelected
      )
    }

    if (this.props.onInstance) {
      this.props.onInstance(this.instance)
    }
  }

  async componentWillUnmount() {
    if (this.instance) {
      await this.instance.teardown()
    }
  }

  shouldComponentUpdate() {
    // Static
    return false
  }

  render() {
    return <div className={this.props.className} ref={ref => (this.wrapper = ref)} />
  }
}

BraintreeDropIn.propTypes = {
  options: PropTypes.object.isRequired,
  preselectVaultedPaymentMethod: PropTypes.bool,
  onInstance: PropTypes.func,
  onNoPaymentMethodRequestable: PropTypes.func,
  onPaymentMethodRequestable: PropTypes.func,
  onPaymentOptionSelected: PropTypes.func,
  className: PropTypes.string,
}

BraintreeDropIn.defaultProps = {
  preselectVaultedPaymentMethod: true
}
