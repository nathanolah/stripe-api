import { Link } from "react-router-dom";
import { useMeQuery } from "../generated/graphql";

const Home = () => {
  const { data, loading } = useMeQuery();
  let body: any = null;

  if (loading) {
    body = <div>loading...</div>;
  } else if (data && data.me) {
    body = (
      <>
        <div>
          <Link to="/account">Account</Link>
        </div>
      </>
    );
  } else {
    body = (
      <>
        <div>
          <Link to="/register">Register</Link>
        </div>
        <div>
          <Link to="/login">Login</Link>
        </div>
      </>
    );
  }

  return (
    <header>
      <div>
        <Link to="/">Home</Link>
      </div>
      {body}
    </header>
  );
};

export default Home;
