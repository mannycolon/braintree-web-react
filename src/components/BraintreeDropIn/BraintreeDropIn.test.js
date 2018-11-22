import React from "react";
import renderer from "react-test-renderer";
import BraintreeDropIn from "./BraintreeDropIn";

describe("BraintreeDropIn", () => {
  it("BraintreeDropIn.create is called on componentDidMount", () => {
    const braintreeWebDropIn = require("braintree-web-drop-in");
    braintreeWebDropIn.create = jest.fn();

    const component = renderer.create(
      <BraintreeDropIn options={{ authorization: "fake-auth" }} />
    );

    const passedArgs = braintreeWebDropIn.create.mock.calls[0];
    expect(passedArgs[0].authorization).toEqual("fake-auth");
  });

  it("Teardown its called on componentWillUnmount", done => {
    const braintreeWebDropIn = require("braintree-web-drop-in");
    const teardownMock = jest.fn();
    braintreeWebDropIn.create = () =>
      new Promise(resolve => {
        resolve({ teardown: teardownMock });
    });

    const component = renderer.create(
      <BraintreeDropIn
        options={{ authorization: "fake-auth" }}
        onInstance={() => {
          component.unmount();
          const callNumber = teardownMock.mock.calls.length;
          expect(callNumber).toEqual(1);
          done();
        }}
      />
    );
  });
});
