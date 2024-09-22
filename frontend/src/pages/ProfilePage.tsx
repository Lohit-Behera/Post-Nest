import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";

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
import { Pencil, UserMinus, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { fetchGetUserInfo } from "@/features/UserSlice";
import { fetchUserAllPosts } from "@/features/PostSlice";
import {
  fetchFollow,
  resetFollow,
  fetchFollowersList,
  fetchFollowingList,
  resetFollowingList,
} from "@/features/FollowSlice";

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
  const follow = useSelector((state: any) => state.follow.follow);
  const followStatus = useSelector((state: any) => state.follow.followStatus);
  const followError = useSelector((state: any) => state.follow.followError);

  const followersList = useSelector((state: any) => state.follow.followersList);
  const followingList = useSelector((state: any) => state.follow.followingList);
  const followingListData = followingList.data || [];
  const followingListStatus = useSelector(
    (state: any) => state.follow.followingListStatus
  );
  const followingListError = useSelector(
    (state: any) => state.follow.followingListError
  );

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

  useEffect(() => {
    if (followStatus === "succeeded") {
      alert(follow.message);
      dispatch(fetchFollowingList(userInfo._id as string));
      dispatch(resetFollow());
    } else if (followStatus === "failed") {
      alert(followError);
      dispatch(resetFollow());
    }
  }, [followStatus, followError, dispatch]);
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
                  <p>Card Content</p>
                </CardContent>
                <CardFooter>
                  <p>Card Footer</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {posts.map((post: any) => (
                    <Card key={post._id}>
                      <CardHeader>
                        <CardTitle>
                          <CardTitle className="flex justify-between ">
                            <div className="flex space-x-2">
                              <Avatar className="w-14 h-14">
                                <AvatarImage src={userData.avatar} />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col space-y-1">
                                <p>{userData.username}</p>
                                <p className="text-sm text-muted-foreground">
                                  {userData.fullName}
                                </p>
                              </div>
                            </div>
                            {userInfo && (
                              <>
                                {userInfo._id !== userData._id && (
                                  <div className="flex space-x-3">
                                    <Button
                                      variant="secondary"
                                      size="icon"
                                      onClick={() =>
                                        dispatch(fetchFollow(userId as string))
                                      }
                                    >
                                      {followingListData.includes(
                                        userData._id
                                      ) ? (
                                        <UserMinus />
                                      ) : (
                                        <UserPlus />
                                      )}
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                          </CardTitle>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Link to={`/post/${post._id}`}>
                          <img
                            src={post.thumbnail}
                            alt=""
                            className="w-full h-52 object-cover rounded-lg"
                          />
                        </Link>
                      </CardContent>
                      <CardFooter>
                        <Link to={`/post/${post._id}`}>
                          <p className="text-lg md:text-xl font-semibold hover:underline line-clamp-1">
                            {post.title}
                          </p>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfilePage;
