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
import { Heart, MessageCircle, Pencil, Trash } from "lucide-react";
import Comments from "@/components/Comments";
import {
  fetchLikeUnlike,
  fetchPostLikes,
  resetLikeUnlike,
} from "@/features/LikeSlice";

function PostDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const userInfo = useSelector((state: any) => state.user.userInfo);
  const postDetails = useSelector((state: any) => state.post.postDetails);
  const post = postDetails.data || {};
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
  const likeUnlike = useSelector((state: any) => state.like.likeUnlike);
  const likeUnlikeStatus = useSelector(
    (state: any) => state.like.likeUnlikeStatus
  );
  const postLikes = useSelector((state: any) => state.like.postLikes);
  const userList = postLikes.data || [];
  const postLikesStatus = useSelector(
    (state: any) => state.like.postLikesStatus
  );
  const postLikesError = useSelector((state: any) => state.like.postLikesError);

  useEffect(() => {
    dispatch(fetchPostDetails(id as string));
    dispatch(fetchPostLikes(id as string));
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

  useEffect(() => {
    if (likeUnlikeStatus === "succeeded") {
      dispatch(fetchPostLikes(id as string));
      dispatch(resetLikeUnlike());
    } else if (likeUnlikeStatus === "failed") {
      alert(postLikesError);
      dispatch(resetLikeUnlike());
    }
  }, [likeUnlikeStatus]);

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
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p>{post.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.fullName}
                    </p>
                  </div>
                </div>
                {userInfo._id === post.author && (
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
              <div className="flex justify-end space-x-2">
                <div className="flex flex-col space-y-0.5">
                  <span
                    className="cursor-pointer"
                    onClick={() => dispatch(fetchLikeUnlike({ postId: id }))}
                  >
                    {userList.includes(userInfo._id) ? (
                      <Heart
                        fill="red"
                        color="red"
                        className="w-6 md:w-7 h-6 md:h-7"
                      />
                    ) : (
                      <Heart className="w-6 md:w-7 h-6 md:h-7" />
                    )}
                  </span>
                  <p className="text-sm md:text-base text-center">
                    {postLikes.data ? postLikes.data.length : 0}
                  </p>
                </div>
                <div className="flex flex-col space-y-0.5">
                  <span className="cursor-pointer">
                    <MessageCircle className="w-6 md:w-7 h-6 md:h-7" />
                  </span>
                  <p className="text-sm md:text-base text-center">
                    {post.totalComments}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Comments id={id} />
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}

export default PostDetailsPage;
