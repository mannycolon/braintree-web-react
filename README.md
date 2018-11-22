# braintree-web-react [![Build Status](https://travis-ci.org/mannycolon/braintree-web-react.svg?branch=master)](https://travis-ci.org/mannycolon/braintree-web-react) ![npm](https://img.shields.io/npm/dt/braintree-web-react.svg) [![npm version](http://img.shields.io/npm/v/braintree-web-react.svg?style=flat)](https://www.npmjs.org/package/braintree-web-react)

React component for Braintree Web Drop-In (v3) & Hosted Fields (v3)

> Inspired by [Cretezy/braintree-web-drop-in-react](https://github.com/Cretezy/braintree-web-drop-in-react).

## Usage

### Hosted-Fields

```js
import React, { Component } from 'react'
import axios from 'axios'
import { BraintreeHostedFields } from 'braintree-web-react'

class App extends Component {
  state = {
    clientToken: null
  }

  instance

  async componentDidMount() {
    try {
      // Get client token for authorization from your server
      const response = await axios.get('http://localhost:8000/api/braintree/v1/getToken')
      const clientToken = response.data.clientToken

      this.setState({ clientToken })
    } catch (err) {
      console.error(err)
    }
  }

  async purchase() {
    try {
      // Send nonce to your server
      const { nonce } = await this.instance.tokenize()

      const response = await axios.post(
        'http://localhost:8000/api/braintree/v1/sandbox',
        { paymentMethodNonce: nonce }
      )

      console.log(response)
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    if (!this.state.clientToken) {
      return (
        <div className="loading-container">
          <h1>Loading...</h1>
        </div>
      )
    } else {
      return (
        <div className="container">
          <BraintreeHostedFields
            className="drop-in-container"
            options={{
              authorization: this.state.clientToken
            }}
            onInstance={(instance) => (this.instance = instance)}
          >
            <form id="cardForm">
              <label className="hosted-fields--label">Card Number</label>
              <div id="card-number" className="hosted-field"></div>

              <label className="hosted-fields--label">Expiration Date</label>
              <div id="expiration-date" className="hosted-field"></div>

              <label className="hosted-fields--label">CVV</label>
              <div id="cvv" className="hosted-field"></div>

              <label className="hosted-fields--label">Postal Code</label>
              <div id="postal-code" className="hosted-field"></div>
            </form>
          </BraintreeHostedFields>
          <button className="submit" onClick={this.purchase.bind(this)}>Submit</button>
        </div>
      )
    }
  }
}
```

### Drop-In

```js
import React from "react"
import axios from 'axios'
import { BraintreeDropIn } from "braintree-web-react"

class App extends React.Component {
  state = {
    clientToken: null
  };

  instance;

  async componentDidMount() {
    // Get client token for braintree authorization from your server
   const response = await axios.get('http://localhost:8000/api/braintree/v1/getToken')
    const clientToken = response.data.clientToken

    this.setState({ clientToken});
  }

  async purchase() {
    // Send nonce to your server
    const { nonce } = await this.instance.requestPaymentMethod();
    const response = await axios.post(
      'http://localhost:8000/api/braintree/v1/sandbox',
      { paymentMethodNonce: nonce }
    )

    console.log(response)
  }

  render() {
    if (!this.state.clientToken) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    } else {
      return (
        <div>
          <BraintreeDropIn
            options={{ authorization: this.state.clientToken }}
            onInstance={instance => (this.instance = instance)}
          />
          <button onClick={this.purchase.bind(this)}>Submit</button>
        </div>
      );
    }
  }
}
```

## Props

### `options` (`object`, required)

Options to setup Braintree.
See [Drop-In options](https://braintree.github.io/braintree-web-drop-in/docs/current/module-braintree-web-drop-in.html#.create).

### `onInstance` (`function: instance`)

Called with the Braintree Drop-In instance when done initializing.
You can call all regular [Drop-In methods](https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html)

The `on` events are already listened to using `onNoPaymentMethodRequestable`,
`onPaymentMethodRequestable`, `onPaymentOptionSelected`. See below.

#### [`instance.requestPaymentMethod([callback])`: `[Promise]`](https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#requestPaymentMethod)

Requests a payment method object which includes the payment method nonce used by by the Braintree Server SDKs.
The structure of this payment method object varies by type: a [cardPaymentMethodPayload](https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#~cardPaymentMethodPayload)
is returned when the payment method is a card, a [paypalPaymentMethodPayload](https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#~paypalPaymentMethodPayload)
is returned when the payment method is a PayPal account.

If a payment method is not available, an error will appear in the UI. When a callback is used, an error will be passed to it. If no callback is used, the returned Promise will be rejected with an error.

Returns a Promise if no callback is provided.

#### [`instance.clearSelectedPaymentMethod()`](https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#clearSelectedPaymentMethod): `void`

Removes the currently selected payment method and returns the customer to the payment options view. Does not remove vaulted payment methods.

#### [`instance.isPaymentMethodRequestable()`](https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#isPaymentMethodRequestable): `boolean`

Returns a boolean indicating if a payment method is available through requestPaymentMethod.
Particularly useful for detecting if using a client token with a customer ID to show vaulted payment methods.

#### [`instance.updateConfiguration(property, key, value)`](https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#updateConfiguration): `void`

Modify your configuration initially set in `options`. Can be used for any paypal or paypalCredit property.

If updateConfiguration is called after a user completes the PayPal authorization flow, any PayPal accounts not stored in the Vault record will be removed.

### `onNoPaymentMethodRequestable`, `onPaymentMethodRequestable`, `onPaymentOptionSelected` (`function: event`)

Ran for [events](https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#on).

* [`onNoPaymentMethodRequestable`](https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#event:paymentMethodRequestable)
* [`onPaymentMethodRequestable`](https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#event:noPaymentMethodRequestable)
* [`onPaymentOptionSelected`](https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#event:paymentOptionSelected)

### `preselectVaultedPaymentMethod` (`boolean`, default: `true`)

Whether or not to initialize with a vaulted payment method pre-selected.
Only applicable when using a client token with a customer with saved payment methods.

## Useful links

* For information regarding `braintree-web-drop-in` or `braintree-web` please see [`braintree/braintree-web-drop-in`](https://github.com/braintree/braintree-web-drop-in) and [`braintree/braintree-web`](https://github.com/braintree/braintree-web).

* <https://www.valentinog.com/blog/react-webpack-babel/>
