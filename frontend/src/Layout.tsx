import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import { useEffect } from "react";
import { fetchUserDetails } from "./features/UserSlice";

function Layout() {
  const dispatch = useDispatch<any>();
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const userDetailsStatus = useSelector(
    (state: any) => state.user.userDetailsStatus
  );
  useEffect(() => {
    if (userInfo) {
      dispatch(fetchUserDetails());
    }
  }, [userInfo, dispatch]);
  return (
    <>
      <Header />
      {userDetailsStatus === "loading" ? (
        <p>Loading</p>
      ) : userDetailsStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <>
          <main>
            <Outlet />
          </main>
        </>
      )}
    </>
  );
}

export default Layout;
