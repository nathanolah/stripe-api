import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/header";
import Account from "./pages/account/Account";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </>
    </BrowserRouter>
  );
};

export default AppRoutes;
