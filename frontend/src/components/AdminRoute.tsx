import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface AdminRouteProps {
  children: JSX.Element;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const navigate = useNavigate();
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const userDetails = useSelector((state: any) => state.user.userDetails);
  const userDetailsStatus = useSelector(
    (state: any) => state.user.userDetailsStatus
  );
  const userDetailsData = userDetails.data || {};

  useEffect(() => {
    if (userDetailsStatus === "succeeded") {
      if (!userInfo || !userDetailsData.isAdmin) {
        navigate("/sign-in");
      }
    }
  }, [userDetailsStatus, userInfo, navigate]);

  return userDetailsStatus === "succeeded"
    ? userInfo && userDetailsData.isAdmin
      ? children
      : null
    : null;
};

export default AdminRoute;
