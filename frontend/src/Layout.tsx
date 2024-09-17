import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import { useEffect } from "react";
import { fetchUserDetails } from "./features/UserSlice";

function Layout() {
  const dispatch = useDispatch<any>();
  const id = useSelector((state: any) => state.user.userInfo?.id);
  useEffect(() => {
    if (id) {
      dispatch(fetchUserDetails());
    }
  }, [id, dispatch]);
  return (
    <>
      <Header />
      <main className="w-[99%] mx-auto">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
