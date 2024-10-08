import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reSignIn } from "@/features/UserSlice";
import { useEffect } from "react";

function TokenExpired() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: any) => state.user.userInfo);

  useEffect(() => {
    if (!userInfo) {
      navigate("/sign-in");
    }
  }, [userInfo, navigate]);
  return (
    <div className="w-full min-h-[80vh] flex justify-center items-center">
      <Card className="w-[98%] md:w-[350px] mx-auto h-full">
        <CardHeader>
          <CardTitle>Re Sign in</CardTitle>
          <CardDescription>Your Session Expired</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            size="sm"
            onClick={() => dispatch(reSignIn())}
          >
            Re-Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default TokenExpired;
