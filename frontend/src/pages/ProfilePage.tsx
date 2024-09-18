import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { useEffect } from "react";
import { fetchGetUserInfo } from "@/features/UserSlice";

function ProfilePage() {
  const { userId } = useParams();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const userInfo = useSelector((state: any) => state.user.userInfo);
  const getUserInfo = useSelector((state: any) => state.user.getUserInfo);
  const getUserInfoStatus = useSelector(
    (state: any) => state.user.getUserInfoStatus
  );
  const userData = getUserInfo.data || {};

  useEffect(() => {
    if (!userInfo) {
      navigate(`/sign-in`);
    } else {
      dispatch(fetchGetUserInfo({ id: userId }));
    }
  }, [userId, dispatch]);
  return (
    <>
      {getUserInfoStatus === "loading" || getUserInfoStatus === "idle" ? (
        <p>Loading</p>
      ) : getUserInfoStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <div>
          <div className="h-52 bg-primary relative">
            <img
              src={userData.coverImage}
              alt=""
              className="h-52 w-full object-cover"
            />
            <Avatar className="w-24 h-24 absolute -bottom-10 left-10 border-4 border-white">
              <AvatarImage src={userData.avatar} className="object-cover" />
              <AvatarFallback>L</AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 bottom-2"
              onClick={() => navigate(`/update-profile/${userData._id}`)}
            >
              <Pencil />
            </Button>
          </div>
          <div className="flex flex-col md:flex-row mt-14 w-full h-full space-x-0 md:space-x-4 space-y-4 md:space-y-0">
            <div className="w-full md:w-[30%]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-2xl ">
                    {userData.username}
                  </CardTitle>
                  <CardDescription>{userData.fullName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card Content</p>
                </CardContent>
                <CardFooter>
                  <p>Card Footer</p>
                </CardFooter>
              </Card>
            </div>
            <div className="w-full md:w-[68%]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-2xl text-center">
                    Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Card Content</p>
                </CardContent>
                <CardFooter>
                  <p>Card Footer</p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfilePage;
