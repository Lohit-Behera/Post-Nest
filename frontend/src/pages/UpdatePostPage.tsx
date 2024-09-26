import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import RichTextEditor from "@/components/TextEditor";
import { useEffect, useState } from "react";
import {
  fetchPostDetails,
  fetchUpdatePost,
  resetUpdatePost,
} from "@/features/PostSlice";
import { Pencil, X } from "lucide-react";
import { toast } from "sonner";

function UpdatePostPage() {
  const { id } = useParams();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const userInfo = useSelector((state: any) => state.user.userInfo);
  const postDetails = useSelector((state: any) => state.post.postDetails);
  const post = postDetails.data ? postDetails.data.post : {};
  const postDetailsStatus = useSelector(
    (state: any) => state.post.postDetailsStatus
  );
  const updatedContent = post.content
    ? post.content.replace("<h1>", '<h1 class="text-3xl font-bold">')
    : "";
  const updatePostStatus = useSelector(
    (state: any) => state.post.updatePostStatus
  );

  const [title, setTitle] = useState(post ? post.title : "");
  const [editTitle, setEditTitle] = useState(false);
  const [content, setContent] = useState(updatedContent);
  const [editContent, setEditContent] = useState(false);
  const [thumbnail, setThumbnail] = useState("");
  const [editThumbnail, setEditThumbnail] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (!userInfo) {
      navigate("/sign-in");
    } else {
      dispatch(fetchPostDetails(id as string));
    }
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (updatePostStatus === "succeeded") {
      navigate(`/post/${id}`);
      dispatch(resetUpdatePost());
    }
  }, [updatePostStatus]);

  const handleUpdate = () => {
    const updatePromise = dispatch(
      fetchUpdatePost({
        id: id as string,
        title: title,
        content: content,
        thumbnail: thumbnail,
        isPublic: isPublic,
      })
    ).unwrap();
    toast.promise(updatePromise, {
      loading: "Updating post...",
      success: (data: any) => {
        return data.message;
      },
      error: (error: any) => {
        return error.message;
      },
    });
  };
  return (
    <>
      {postDetailsStatus === "loading" || postDetailsStatus === "idle" ? (
        <p>Loading</p>
      ) : postDetailsStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <div className="w-[90%] mx-auto bg-accent p-4 rounded-lg my-10">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              {editTitle ? (
                <div className="flex space-x-3">
                  <Input
                    className="bg-background"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Button
                    className="my-auto"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditTitle(false)}
                  >
                    <X />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between space-x-3">
                  <p className="my-auto">{post?.title || ""}</p>
                  <Button
                    className="my-auto"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditTitle(true)}
                  >
                    <Pencil />
                  </Button>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Content</Label>
              {editContent ? (
                <div className="w-full flex flex-col space-y-3">
                  <RichTextEditor
                    value={post.content || ""}
                    onChange={setContent}
                  />
                  <Button
                    className="mx-auto"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditContent(false)}
                  >
                    <X />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between space-x-3">
                  <div dangerouslySetInnerHTML={{ __html: updatedContent }} />
                  <Button
                    className="my-auto"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditContent(true)}
                  >
                    <Pencil />
                  </Button>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Thumbnail</Label>
              {editThumbnail ? (
                <div className="flex space-x-3 w-full">
                  <Input
                    className="bg-background w-full"
                    type="file"
                    onChange={(e) => setThumbnail(e.target.files![0].name)}
                  />
                  <Button
                    className="my-auto"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditThumbnail(false)}
                  >
                    <X />
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <img
                    className="w-[50%] rounded-lg"
                    src={post?.thumbnail}
                    alt=""
                  />
                  <Button
                    className="my-auto"
                    variant="outline"
                    size="icon"
                    onClick={() => setEditThumbnail(true)}
                  >
                    <Pencil />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Checkbox
                className="my-auto"
                checked={isPublic === true ? true : false}
                onCheckedChange={(e) => setIsPublic(e === true ? true : false)}
              />
              <Label>Public</Label>
            </div>
            <Button onClick={handleUpdate} className="w-full">
              Submit
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default UpdatePostPage;
