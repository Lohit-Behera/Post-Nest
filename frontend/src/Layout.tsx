import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/Header";
import { useEffect } from "react";
import { fetchUserDetails } from "./features/UserSlice";
import { fetchFollowingList } from "./features/FollowSlice";
import GlobalLoader from "./components/Loader/GlobalLoader/GlobalLoader";

function Layout() {
  const dispatch = useDispatch<any>();
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const userDetailsStatus = useSelector(
    (state: any) => state.user.userDetailsStatus
  );
  useEffect(() => {
    if (userInfo) {
      dispatch(fetchUserDetails());
      dispatch(fetchFollowingList(userInfo._id));
    }
  }, [userInfo, dispatch]);
  return (
    <>
      {userDetailsStatus === "loading" ? (
        <GlobalLoader fullHight />
      ) : userDetailsStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <>
          <Header />
          <main>
            <Outlet />
          </main>
        </>
      )}
    </>
  );
}

export default Layout;
