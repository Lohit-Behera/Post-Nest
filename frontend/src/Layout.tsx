import { Outlet, ScrollRestoration } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import Header from "./components/Header";
import { useEffect } from "react";
import { fetchUserDetails } from "./features/UserSlice";
import { fetchFollowingList } from "./features/FollowSlice";
import GlobalLoader from "./components/Loader/GlobalLoader/GlobalLoader";
import ServerErrorPage from "./pages/Error/ServerErrorPage";
import SomethingWentWrong from "./pages/Error/SomethingWentWrong";

function Layout() {
  const dispatch = useDispatch<any>();
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const userDetailsStatus = useSelector(
    (state: any) => state.user.userDetailsStatus
  );
  const logoutStatus = useSelector((state: any) => state.user.logoutStatus);
  useEffect(() => {
    if (userInfo) {
      dispatch(fetchUserDetails());
      dispatch(fetchFollowingList(userInfo._id));
    }
  }, [userInfo, dispatch]);
  return (
    <>
      {userDetailsStatus === "loading" || logoutStatus === "loading" ? (
        <GlobalLoader fullHight />
      ) : userDetailsStatus === "failed" ? (
        <ServerErrorPage />
      ) : (
        <>
          <ErrorBoundary FallbackComponent={SomethingWentWrong}>
            <Header />
            <main className="overflow-x-hidden">
              <ScrollRestoration />
              <Outlet />
            </main>
          </ErrorBoundary>
        </>
      )}
    </>
  );
}

export default Layout;
