import React from 'react'
import BraintreeHostedFields from './components/BraintreeHostedFields'
import BraintreeDropIn from './components/BraintreeDropIn'

const BraintreeWebDropIn = (props) => {
  const { isHostedFields } = props

  if (isHostedFields) {
    return <BraintreeHostedFields {...props}/>
  } else {
    return <BraintreeDropIn {...props}/>
  }
}

export default BraintreeWebDropIn
