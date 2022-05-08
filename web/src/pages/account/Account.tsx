import React from "react";
import { Navigate } from "react-router-dom";
import { useMeQuery } from "../../generated/graphql";
import CancelSubscription from "./CancelSubscription";
import ChangeCreditCard from "./ChangeCreditCard";
import SubscribeUser from "./SubscribeUser";

const Account = () => {
  const { data, loading } = useMeQuery();

  let body: any = null;

  if (loading) {
    body = <div>Loading...</div>;
  } else if (data && data.me) {
    if (data.me.type === "paid") {
      body = (
        <>
          <div>You are logged in as: {data.me.email}</div>
          <div>Your account membership is: {data.me.type}</div>
          <div>Last 4 digits of credit card: {data.me.ccLast4}</div>
          <div>
            <ChangeCreditCard />
          </div>
          <div>
            <CancelSubscription />
          </div>
        </>
      );
    } else {
      body = (
        <>
          <div>You are logged in as: {data.me.email}</div>
          <div>Your account membership is: {data.me.type}</div>
          <div>
            <SubscribeUser />
          </div>
        </>
      );
    }
  } else {
    body = <Navigate to="/login" />;
  }

  return <div>{body}</div>;
};

export default Account;
