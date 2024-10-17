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
import {
  ArrowUp,
  BadgeCheck,
  Loader2,
  Pencil,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { fetchGetUserInfo, fetchSendVerifyEmail } from "@/features/UserSlice";
import {
  fetchUserAllPosts,
  resetUserPosts,
  addProfilePosts,
  resetProfilePosts,
} from "@/features/PostSlice";
import {
  fetchFollow,
  fetchFollowingList,
  resetFollow,
} from "@/features/FollowSlice";
import { Separator } from "@/components/ui/separator";
import Post from "@/components/Post";
import { toast } from "sonner";
import ProfileLoader from "@/components/Loader/ProfileLoader";
import PostLoader from "@/components/Loader/PostLoader";
import ServerErrorPage from "./Error/ServerErrorPage";
import FollowList from "@/components/FollowList";

function ProfilePage() {
  const { userId } = useParams();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const userInfo = useSelector((state: any) => state.user.userInfo);
  const userDetails = useSelector((state: any) => state.user.userDetails);
  const userDetailsData = userDetails.data || {};
  const getUserInfo = useSelector((state: any) => state.user.getUserInfo);
  const getUserInfoStatus = useSelector(
    (state: any) => state.user.getUserInfoStatus
  );
  const userData = getUserInfo.data || {};
  const userAllPosts = useSelector((state: any) => state.post.userAllPosts);
  const userAllPostsStatus = useSelector(
    (state: any) => state.post.userAllPostsStatus
  );
  const userAllPostsError = useSelector(
    (state: any) => state.post.userAllPostsError
  );
  const followStatus = useSelector((state: any) => state.follow.followStatus);
  const followError = useSelector((state: any) => state.follow.followError);
  const followingList = useSelector((state: any) => state.follow.followingList);
  const followingListData = followingList.data || [];
  const followingListStatus = useSelector(
    (state: any) => state.follow.followingListStatus
  );
  const profilePosts = useSelector((state: any) => state.post.profilePosts);

  const [once, setOnce] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (profilePosts.length === 0 || profilePosts[0].author !== userId) {
      dispatch(resetProfilePosts());
      setPage(1);
      setHasMore(false);
      setOnce(true);
      dispatch(fetchUserAllPosts({ id: userId as string, page }));
    }
    if (userData._id !== userId) {
      dispatch(fetchGetUserInfo(userId as string));
      if (userInfo) {
        dispatch(fetchFollowingList(userInfo._id as string));
      }
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (userAllPostsStatus === "succeeded") {
      if (once) {
        dispatch(addProfilePosts(userAllPosts.data.docs));
        setOnce(false);
      }
      setHasMore(userAllPosts.data.hasNextPage);
      setPage(userAllPosts.data.nextPage);
      dispatch(resetUserPosts());
    } else if (userAllPostsStatus === "failed") {
      toast.error(userAllPostsError);
    }
  }, [userAllPostsStatus, dispatch]);

  useEffect(() => {
    if (followStatus === "succeeded") {
      dispatch(resetFollow());
    } else if (followStatus === "failed") {
      dispatch(resetFollow());
    }
  }, [followStatus, followError, dispatch]);

  const handleFollow = (id: string) => {
    if (followStatus === "idle") {
      const followPromise = dispatch(fetchFollow(id)).unwrap();
      toast.promise(followPromise, {
        loading: "Following...",
        success: (data: any) => {
          return data.message;
        },
        error: (error: any) => {
          return error;
        },
      });
    }
  };

  const handleScroll = useCallback(() => {
    const scrollableHeight = document.documentElement.scrollHeight;
    const scrolledFromTop = window.innerHeight + window.scrollY;
    const scrollTrigger = (scrollableHeight * 90) / 100;

    if (Math.ceil(scrolledFromTop) > scrollTrigger) {
      if (hasMore) {
        setOnce(true);
        dispatch(fetchUserAllPosts({ id: userId as string, page }));
      }
    }

    if (window.scrollY > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  }, [hasMore, dispatch, page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleVerifyAccount = () => {
    const verifyPromise = dispatch(fetchSendVerifyEmail()).unwrap();
    toast.promise(verifyPromise, {
      loading: "Verifying...",
      success: (data: any) => {
        return data.message;
      },
      error: (error: any) => {
        return error;
      },
    });
  };

  return (
    <>
      {getUserInfoStatus === "loading" || getUserInfoStatus === "idle" ? (
        <ProfileLoader />
      ) : getUserInfoStatus === "failed" ? (
        <ServerErrorPage />
      ) : (
        <div className="mb-6">
          <div className="h-52 bg-secondary relative ">
            <img
              src={userData.coverImage}
              alt=""
              loading="lazy"
              className="h-52 w-full object-cover"
            />
            <Avatar className="w-24 h-24 absolute -bottom-10 left-10 border-4 border-white">
              <AvatarImage src={userData.avatar} className="object-cover" />
              <AvatarFallback>
                {userData.username ? userData.username[0] : "A"}
              </AvatarFallback>
            </Avatar>
            {userInfo && userData._id === userInfo._id && (
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
          {userInfo && userDetailsData._id !== userData._id && (
            <div className="mt-2 flex justify-end p-2">
              <Button
                className=" "
                variant="outline"
                disabled={
                  followStatus === "loading" ||
                  followingListStatus === "loading"
                }
                onClick={() => handleFollow(userData._id)}
              >
                {followStatus === "loading" ||
                followingListStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Loading...
                  </>
                ) : followingListData.includes(userData._id) ? (
                  <>
                    <UserMinus className="mr-2 h-4 w-4" /> Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" /> Follow
                  </>
                )}
              </Button>
            </div>
          )}

          {userData._id === userDetailsData._id &&
            !userDetailsData.isVerified && (
              <div className="mt-2 flex justify-end p-2">
                <Button
                  className=" "
                  variant="outline"
                  onClick={handleVerifyAccount}
                >
                  <BadgeCheck className="mr-2 h-4 w-4" /> Verify Account
                </Button>
              </div>
            )}
          <div className="flex flex-col md:flex-row mt-8 mx-2 w-full h-full space-x-0 md:space-x-4 space-y-4 md:space-y-0">
            <div className="w-full md:w-[30%]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-2xl ">
                    {userData.username}
                  </CardTitle>
                  <CardDescription>{userData.fullName}</CardDescription>
                </CardHeader>
                <CardContent>
                  {userData.bio ? <p>{userData.bio} </p> : <p>No bio</p>}
                  <Separator className="mt-2" />
                  {userData.website ? (
                    <Button variant="link" asChild>
                      <a href={userData.website} target="_blank">
                        Website
                      </a>
                    </Button>
                  ) : (
                    <p>No website</p>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="border-2 rounded-lg p-2 w-full space-y-2">
                    <div className="grid gap-2 grid-cols-2 mx-auto">
                      <FollowList
                        userId={userData._id}
                        followNumber={userData.totalFollowing}
                        text="Following"
                        following
                      />
                      <FollowList
                        userId={userData._id}
                        followNumber={userData.totalFollowers}
                        text="Followers"
                        following={false}
                      />
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <div className="flex flex-col w-1/2">
                        <p className="text-sm text-center font-bold">
                          {userData.totalPosts}
                        </p>
                        <p className="text-sm text-center font-semibold text-muted-foreground">
                          Posts
                        </p>
                      </div>
                      <div className="flex flex-col w-1/2">
                        <p className="text-sm text-center font-bold">
                          {userData.totalLikes}
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
              {userAllPostsStatus === "loading" && profilePosts.length === 0 ? (
                <PostLoader />
              ) : userAllPostsStatus === "failed" ? (
                <p>Error</p>
              ) : (
                <div className="w-[98%] md:w-[95%] mx-auto">
                  {profilePosts.length === 0 ? (
                    <p className="text-center text-lg md:text-xl font-semibold mt-6">
                      {!userInfo || userDetailsData._id !== userData._id
                        ? "This user didn't create any posts yet"
                        : "You didn't create any posts yet"}
                    </p>
                  ) : (
                    <>
                      {showScrollToTop && (
                        <Button
                          className="fixed bottom-10 right-10 rounded-full w-11 h-11 z-10"
                          variant="secondary"
                          onClick={scrollToTop}
                          size="icon"
                        >
                          <ArrowUp />
                        </Button>
                      )}
                      <Post posts={profilePosts} followButton />
                      {userAllPostsStatus === "loading" && (
                        <div className="flex justify-center mt-6">
                          <Loader2 className="animate-spin w-14 h-14" />
                        </div>
                      )}
                      {!hasMore && (
                        <p className="text-center text-lg md:text-xl font-semibold mt-6">
                          No more posts
                        </p>
                      )}
                    </>
                  )}
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
