import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { resetUserDetails, reSignIn } from "@/features/UserSlice";
import { useEffect } from "react";

function TokenExpired() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(reSignIn());
    dispatch(resetUserDetails());
  }, []);
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
            onClick={() => {
              navigate("/sign-in");
            }}
          >
            Re-Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default TokenExpired;
