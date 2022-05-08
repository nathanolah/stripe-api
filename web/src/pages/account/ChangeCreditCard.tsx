import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { useChangeCreditCardMutation } from "../../generated/graphql";

const ChangeCreditCard = () => {
  const [changeCreditCard] = useChangeCreditCardMutation();

  return (
    <StripeCheckout
      token={async (token) => {
        const response = await changeCreditCard({
          variables: {
            source: token.id,
            ccLast4: token.card.last4,
          },
        });

        console.log(response);
      }}
      stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE!}
      label={"Change Credit Card"}
    />
  );
};

export default ChangeCreditCard;
