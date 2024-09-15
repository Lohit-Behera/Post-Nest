import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function Layout() {
  return (
    <>
      <Header />
      <main className="w-[98%] mx-auto">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
