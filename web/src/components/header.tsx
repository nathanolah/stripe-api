import { useMeQuery } from "../generated/graphql";
import Logout from "./Logout";

export const Header = () => {
  // TO DO : CREATE A NAV BAR
  const { data, loading } = useMeQuery();

  let body: any = null;

  if (loading) {
    body = <div>loading...</div>;
  } else if (data && data.me) {
    body = (
      <div>
        <Logout />
      </div>
    );
  } else {
    body = null;
  }

  return <>{body}</>;
};
