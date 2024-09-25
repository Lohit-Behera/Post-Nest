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
import { fetchUserAllPosts } from "@/features/PostSlice";
import { fetchFollowersList, fetchFollowingList } from "@/features/FollowSlice";
import { Separator } from "@/components/ui/separator";
import Post from "@/components/Post";

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
  const userAllPosts = useSelector((state: any) => state.post.userAllPosts);
  const posts = userAllPosts.data ? userAllPosts.data.docs : [];
  const userAllPostsStatus = useSelector(
    (state: any) => state.post.userAllPostsStatus
  );

  const followersList = useSelector((state: any) => state.follow.followersList);
  const followingList = useSelector((state: any) => state.follow.followingList);
  const followingListData = followingList.data || [];

  useEffect(() => {
    if (!userInfo) {
      navigate(`/sign-in`);
    } else {
      dispatch(fetchGetUserInfo(userId as string));
      dispatch(fetchUserAllPosts(userId as string));
      dispatch(fetchFollowersList(userId as string));
      dispatch(fetchFollowingList(userInfo._id as string));
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
          <div className="h-52 bg-secondary relative">
            <img
              src={userData.coverImage}
              alt=""
              className="h-52 w-full object-cover"
            />
            <Avatar className="w-24 h-24 absolute -bottom-10 left-10 border-4 border-white">
              <AvatarImage src={userData.avatar} className="object-cover" />
              <AvatarFallback>L</AvatarFallback>
            </Avatar>
            {userData._id === userInfo._id && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 bottom-2"
                onClick={() => navigate(`/update-profile/${userData._id}`)}
              >
                <Pencil />
              </Button>
            )}
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
                  {userData.bio ? <p>{userData.bio}</p> : <p>No bio</p>}
                </CardContent>
                <CardFooter>
                  <div className="border-2 rounded-lg p-2 w-full space-y-2">
                    <div className="flex justify-between">
                      <div className="flex flex-col w-1/2">
                        <p className="text-sm text-center font-semibold">
                          {userData.totalPosts}
                        </p>
                        <p className="text-sm text-center font-semibold text-muted-foreground">
                          Following
                        </p>
                      </div>
                      <div className="flex flex-col w-1/2">
                        <p className="text-sm text-center">
                          {userData.totalFollowers}
                        </p>
                        <p className="text-sm text-center font-semibold text-muted-foreground">
                          Followers
                        </p>
                      </div>
                    </div>
                    <Separator />

                    <div className="flex justify-between">
                      <div className="flex flex-col w-1/2">
                        <p className="text-sm text-center font-semibold">
                          {posts.length}
                        </p>
                        <p className="text-sm text-center font-semibold text-muted-foreground">
                          Posts
                        </p>
                      </div>
                      <div className="flex flex-col w-1/2">
                        <p className="text-sm text-center">
                          {followersList.data?.length}
                        </p>
                        <p className="text-sm text-center font-semibold text-muted-foreground">
                          Total Likes
                        </p>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
            <div className="w-full md:w-[68%]">
              {userAllPostsStatus === "loading" ||
              userAllPostsStatus === "idle" ? (
                <p>Loading</p>
              ) : userAllPostsStatus === "failed" ? (
                <p>Error</p>
              ) : (
                <Post posts={posts} followingList={followingListData} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfilePage;
