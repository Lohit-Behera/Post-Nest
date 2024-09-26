import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, UserMinus, UserPlus } from "lucide-react";
import {
  fetchFollow,
  fetchFollowingList,
  resetFollow,
} from "@/features/FollowSlice";
import { useEffect } from "react";
import { toast } from "sonner";
function Post({ posts, followButton = false, twoPosts = false }: any) {
  const dispatch = useDispatch<any>();
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const followStatus = useSelector((state: any) => state.follow.followStatus);
  const followError = useSelector((state: any) => state.follow.followError);
  const followingList = useSelector((state: any) => state.follow.followingList);
  const followingListData = followingList.data || [];
  const followingListStatus = useSelector(
    (state: any) => state.follow.followingListStatus
  );
  useEffect(() => {
    if (followStatus === "succeeded") {
      dispatch(fetchFollowingList(userInfo._id as string));
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
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${
        !twoPosts && "lg:grid-cols-3"
      } gap-4`}
    >
      {posts.map((post: any) => (
        <Card key={post._id}>
          <CardHeader>
            <CardTitle>
              <CardTitle className="flex justify-between ">
                <div className="flex space-x-2">
                  <Link to={`/profile/${post.author}`}>
                    <Avatar className="w-12 h-12 border-primary hover:border">
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex flex-col space-y-0.5">
                    <Link to={`/profile/${post.author}`}>
                      <p className="text-sm md:text-base hover:underline">
                        {post.username}
                      </p>
                    </Link>
                    <Link to={`/profile/${post.author}`}>
                      <p className="text-sm text-muted-foreground hover:underline">
                        {post.fullName}
                      </p>
                    </Link>
                  </div>
                </div>
                {followButton && userInfo && (
                  <>
                    {userInfo._id !== post.author && (
                      <div className="flex space-x-3">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => handleFollow(post.author)}
                          disabled={
                            followStatus === "loading" ||
                            followingListStatus === "loading"
                          }
                        >
                          {followingListData.includes(post.author) ? (
                            <UserMinus />
                          ) : followStatus === "loading" ||
                            followingListStatus === "loading" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
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
  );
}

export default Post;
