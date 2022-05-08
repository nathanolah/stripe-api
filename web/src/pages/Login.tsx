import { useState } from "react";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { client }] = useLoginMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await login({
      variables: {
        email,
        password,
      },

      update: (store, { data }) => {
        if (!data) {
          return null;
        }

        // update the apollo cache after login, avoids having to refresh the page
        store.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            me: data.login,
          },
        });
      },
    });

    console.log(response);

    navigate("/account");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <input
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          onClick={async () => {
            // reset the cache before the user logs in.
            await client.resetStore();
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
