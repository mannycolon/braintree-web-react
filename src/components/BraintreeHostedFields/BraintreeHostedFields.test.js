import React from "react";
import renderer from "react-test-renderer";
import BraintreeHostedFields from "./BraintreeHostedFields";

describe("BraintreeHostedFields", () => {
  it("BraintreeHostedFields.create is called on componentDidMount", () => {
    const braintreeWebDropIn = require("braintree-web");
    braintreeWebDropIn.client.create = jest.fn();

    const component = renderer.create(
      <BraintreeHostedFields options={{ authorization: "fake-auth-hostedFields" }} />
    );

    const passedArgs = braintreeWebDropIn.client.create.mock.calls[0];

    expect(passedArgs[0].authorization).toEqual("fake-auth-hostedFields");
  });

  it("Teardown its called on componentWillUnmount", done => {
    const braintreeWebDropIn = require("braintree-web");
    const teardownMock = jest.fn();

    braintreeWebDropIn.client.create = (n, callback) => {
      callback()
    }

    braintreeWebDropIn.hostedFields.create = (n, callback) => {
      callback(false, { teardown: teardownMock })
    }

    const component = renderer.create(
      <BraintreeHostedFields
        options={{ authorization: "fake-auth-hostedFields" }}
        onInstance={() => {}}
      />
    );
    component.unmount()
    const callNumber = teardownMock.mock.calls.length;
    expect(callNumber).toEqual(1);
    done();
  });
});
