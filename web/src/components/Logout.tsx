import { useLogoutMutation } from "../generated/graphql";

const Logout = () => {
  const [logout, { client }] = useLogoutMutation();

  return (
    <button
      onClick={async () => {
        await logout();
        await client.resetStore();
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
