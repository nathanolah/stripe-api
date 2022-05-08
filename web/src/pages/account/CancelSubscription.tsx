import React from "react";
import { useCancelSubscriptionMutation } from "../../generated/graphql";

const CancelSubscription = () => {
  const [cancelSubscription] = useCancelSubscriptionMutation();

  return (
    <button
      onClick={async () => {
        await cancelSubscription();
      }}
    >
      Cancel Subscription
    </button>
  );
};

export default CancelSubscription;
