import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostDetails } from "@/features/PostSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function PostDetailsPage() {
  const { id } = useParams();

  const dispatch = useDispatch<any>();

  const postDetails = useSelector((state: any) => state.post.postDetails);
  const post = postDetails.data ? postDetails.data.post : {};
  const user = postDetails.data ? postDetails.data.user : {};
  const PostDetailsStatus = useSelector(
    (state: any) => state.post.postDetailsStatus
  );
  const updatedContent = post.content
    ? post.content.replace("<h1>", '<h1 class="text-3xl font-bold">')
    : "";

  useEffect(() => {
    dispatch(fetchPostDetails(id as string));
  }, [dispatch, id]);

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
              <CardTitle className="flex space-x-2">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p>{user.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.fullName}
                  </p>
                </div>
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
