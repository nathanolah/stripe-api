import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { useCreateSubscriptionMutation } from "../../generated/graphql";

const SubscribeUser = () => {
  const [createSubscription] = useCreateSubscriptionMutation();

  return (
    <StripeCheckout
      token={async (token) => {
        const response = await createSubscription({
          variables: {
            source: token.id,
            ccLast4: token.card.last4,
          },
        });

        console.log(response);
      }}
      stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE!}
      amount={1000}
      // bitcoin={true}
    />
  );
};

export default SubscribeUser;
