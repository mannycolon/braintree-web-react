import React from "react";
import PropTypes from "prop-types";
import Braintree from 'braintree-web';

export default class BraintreeWebDropInComponent extends React.Component {
  state = {
    hostedFieldsInstance: null,
  }

  wrapper;
  hostedFieldsInstance;

  async componentDidMount() {
    await Braintree.client.create({
      authorization: this.props.options.authorization
    }, (err, clientInstance) => {
      if (err) {
        console.error(err);
        return;
      }
      this.createHostedFields(clientInstance);
    });
  }

  async componentWillUnmount() {
    if (this.hostedFieldsInstance) {
      await this.hostedFieldsInstance.teardown();
    }
  }

  shouldComponentUpdate() {
    // Static
    return false;
  }

  createHostedFields(clientInstance) {
    Braintree.hostedFields.create({
      client: clientInstance,
      styles: {
        ':focus': {
          'color': 'black'
        },
        '.valid': {
          'color': '#8bdda8'
        }
      },
      fields: {
        number: {
          selector: '#card-number',
          placeholder: '4111 1111 1111 1111'
        },
        cvv: {
          selector: '#cvv',
          placeholder: '123'
        },
        expirationDate: {
          selector: '#expiration-date',
          placeholder: 'MM/YYYY'
        },
        postalCode: {
          selector: '#postal-code',
          placeholder: '11111'
        }
      }
    }, (err, hostedFieldsInstance) => {
      if (err)
        console.error(err)
      else {
        this.hostedFieldsInstance = hostedFieldsInstance
        if (this.props.onInstance) {
          this.props.onInstance(hostedFieldsInstance);
        }
      }
    })
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.props.children}
      </div>
    )
  }
}

BraintreeWebDropInComponent.propTypes = {
  options: PropTypes.object.isRequired,
  preselectVaultedPaymentMethod: PropTypes.bool,
  onInstance: PropTypes.func,
  onNoPaymentMethodRequestable: PropTypes.func,
  onPaymentMethodRequestable: PropTypes.func,
  onPaymentOptionSelected: PropTypes.func,
  className: PropTypes.string,
};

BraintreeWebDropInComponent.defaultProps = {
  preselectVaultedPaymentMethod: true
};
