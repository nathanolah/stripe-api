import React from "react";
import { Link } from "react-router-dom";
import { useMeQuery } from "../generated/graphql";

const Me = () => {
  const { data, loading } = useMeQuery();

  let body: any = null;

  if (loading) {
    body = <div>Loading...</div>;
  } else if (data && data.me) {
    body = <div>You are logged in as: {data.me.email}</div>;
  } else {
    body = <div>Not logged in</div>;
  }

  return (
    <header>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/register">Register</Link>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>
      {body}
    </header>
  );
};

export default Me;
