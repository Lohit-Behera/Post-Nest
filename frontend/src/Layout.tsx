import { Outlet, ScrollRestoration, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import Header from "./components/Header";
import { useEffect } from "react";
import { fetchUserDetails, resetUserDetails } from "./features/UserSlice";
import { fetchFollowingList } from "./features/FollowSlice";
import GlobalLoader from "./components/Loader/GlobalLoader/GlobalLoader";
import ServerErrorPage from "./pages/Error/ServerErrorPage";
import SomethingWentWrong from "./pages/Error/SomethingWentWrong";
import { toast } from "sonner";

function Layout() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const userDetailsStatus = useSelector(
    (state: any) => state.user.userDetailsStatus
  );
  const userDetailsError = useSelector(
    (state: any) => state.user.userDetailsError
  );
  const logoutStatus = useSelector((state: any) => state.user.logoutStatus);
  useEffect(() => {
    if (userInfo) {
      dispatch(fetchUserDetails());
      dispatch(fetchFollowingList(userInfo._id));
    }
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (userDetailsError === "Refresh token expired") {
      toast.error("Your session has expired. Please sign in again.");
      navigate("/token-expired");
      dispatch(resetUserDetails());
    }
  });
  return (
    <>
      {userDetailsStatus === "loading" || logoutStatus === "loading" ? (
        <GlobalLoader fullHight />
      ) : userDetailsStatus === "failed" ? (
        <ServerErrorPage />
      ) : (
        <div className="min-h-[100vh]">
          <ErrorBoundary FallbackComponent={SomethingWentWrong}>
            <Header />
            <main className="overflow-x-hidden">
              <ScrollRestoration />
              <Outlet />
            </main>
          </ErrorBoundary>
        </div>
      )}
    </>
  );
}

export default Layout;
