import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeletePost,
  fetchPostDetails,
  resetDeletePost,
} from "@/features/PostSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash } from "lucide-react";

function PostDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const userInfo = useSelector((state: any) => state.user.userInfo);
  const postDetails = useSelector((state: any) => state.post.postDetails);
  const post = postDetails.data ? postDetails.data.post : {};
  const user = postDetails.data ? postDetails.data.user : {};
  const PostDetailsStatus = useSelector(
    (state: any) => state.post.postDetailsStatus
  );
  const updatedContent = post.content
    ? post.content.replace("<h1>", '<h1 class="text-3xl font-bold">')
    : "";
  const deletePost = useSelector((state: any) => state.post.deletePost);
  const deletePostStatus = useSelector(
    (state: any) => state.post.deletePostStatus
  );
  const deletePostError = useSelector(
    (state: any) => state.post.deletePostError
  );

  console.log(userInfo._id === user._id);

  useEffect(() => {
    dispatch(fetchPostDetails(id as string));
  }, [dispatch, id]);

  useEffect(() => {
    if (deletePostStatus === "succeeded") {
      alert(deletePost.message);
      dispatch(resetDeletePost());
      navigate("/");
    } else if (deletePostStatus === "failed") {
      alert(deletePostError);
      dispatch(resetDeletePost());
    }
  });

  return (
    <>
      {PostDetailsStatus === "loading" || PostDetailsStatus === "idle" ? (
        <p>Loading</p>
      ) : PostDetailsStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <div className="w-full md:w-[90%] mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between ">
                <div className="flex space-x-2">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p>{user.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.fullName}
                    </p>
                  </div>
                </div>
                {userInfo._id === user._id && (
                  <div className="flex space-x-3">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => {
                        navigate(`/post/update/${id}`);
                      }}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => dispatch(fetchDeletePost(id as string))}
                    >
                      <Trash />
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <p className="text-xl md:text-3xl font-semibold">{post.title}</p>
              <img className="rounded-lg" src={post.thumbnail} alt="" />
              <div dangerouslySetInnerHTML={{ __html: updatedContent }} />
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}

export default PostDetailsPage;
