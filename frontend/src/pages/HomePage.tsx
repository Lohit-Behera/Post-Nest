import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchFollowingPosts } from "@/features/PostSlice";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

function HomePage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const useInfo = useSelector((state: any) => state.user.userInfo);
  const followingPosts =
    useSelector((state: any) => state.post.followingPosts) || [];
  const posts = followingPosts.data ? followingPosts.data.docs : [];
  const followingPostsStatus = useSelector(
    (state: any) => state.post.followingPostsStatus
  );

  useEffect(() => {
    if (!useInfo) {
      navigate("/sign-in");
    } else {
      dispatch(fetchFollowingPosts());
    }
  }, []);
  return (
    <>
      {followingPostsStatus === "loading" || followingPostsStatus === "idle" ? (
        <p>Loading</p>
      ) : followingPostsStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <div className="w-[98%] md:w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-10 ">
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
                    {useInfo._id !== post.author && (
                      <div className="flex space-x-3">
                        <Button variant="secondary" size="icon">
                          <UserPlus />
                        </Button>
                      </div>
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
    </>
  );
}

export default HomePage;
