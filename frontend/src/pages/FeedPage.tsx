import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchAllPosts } from "@/features/PostSlice";
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

function FeedPage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const useInfo = useSelector((state: any) => state.user.userInfo);
  const allPosts = useSelector((state: any) => state.post.allPosts);
  const posts = allPosts.data ? allPosts.data.docs : [];
  useEffect(() => {
    if (!useInfo) {
      navigate("/sign-in");
    } else {
      dispatch(fetchAllPosts());
    }
  }, [useInfo, dispatch, navigate]);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-10">
        {posts.map((post: any) => (
          <Card key={post._id}>
            <CardHeader>
              <CardTitle>
                <CardTitle className="flex justify-between ">
                  <div className="flex space-x-2">
                    <Link to={`/profile/${post.authorDetails._id}`}>
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={post.authorDetails.avatar} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex flex-col space-y-1">
                      <p>{post.authorDetails.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {post.authorDetails.fullName}
                      </p>
                    </div>
                  </div>
                  {useInfo._id !== post.authorDetails._id && (
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
    </>
  );
}

export default FeedPage;
