import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, Pencil, Trash, X } from "lucide-react";
import {
  fetchCreateComment,
  fetchDeleteComment,
  fetchGetComments,
  fetchUpdateComment,
  resetCreateComment,
  resetDeleteComment,
  resetUpdateComment,
} from "@/features/CommentSlice";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function Comments({ id }: any) {
  const dispatch = useDispatch<any>();

  const userInfo = useSelector((state: any) => state.user.userInfo);
  const createCommentStatus = useSelector(
    (state: any) => state.comment.createCommentStatus
  );
  const getComments = useSelector((state: any) => state.comment.getComments);
  const comments = getComments.data ? getComments.data.docs : [];
  const getCommentsStatus = useSelector(
    (state: any) => state.comment.getCommentsStatus
  );
  const getCommentsError = useSelector(
    (state: any) => state.comment.getCommentsError
  );
  const updateCommentStatus = useSelector(
    (state: any) => state.comment.updateCommentStatus
  );
  const deleteCommentStatus = useSelector(
    (state: any) => state.comment.deleteCommentStatus
  );

  useEffect(() => {
    dispatch(fetchGetComments(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (createCommentStatus === "succeeded") {
      dispatch(resetCreateComment());
      dispatch(fetchGetComments(id));
    } else if (createCommentStatus === "failed") {
    } else if (updateCommentStatus === "succeeded") {
      dispatch(resetUpdateComment());
      dispatch(fetchGetComments(id));
    } else if (updateCommentStatus === "failed") {
      dispatch(resetUpdateComment());
    }
  }, [createCommentStatus, updateCommentStatus]);

  useEffect(() => {
    if (deleteCommentStatus === "succeeded") {
      dispatch(fetchGetComments(id));
      dispatch(resetDeleteComment());
    } else if (deleteCommentStatus === "failed") {
      dispatch(resetDeleteComment());
    }
  }, [deleteCommentStatus]);

  const [comment, setComment] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [updateComment, setUpdateComment] = useState("");

  const handleComment = () => {
    if (!comment) {
      alert("Please write a comment");
    } else {
      dispatch(
        fetchCreateComment({
          postId: id,
          comment: comment,
        })
      );
      setComment("");
    }
  };

  const handleEditButton = (userComment: any) => {
    setIsEdit(!isEdit);
    setEditId(userComment.id);
    setUpdateComment(userComment.comment);
  };

  const handleCommentEdit = (commentId: any) => {
    console.log(commentId);

    if (!updateComment) {
      alert("Please enter a comment");
    } else {
      dispatch(
        fetchUpdateComment({
          commentId: commentId,
          comment: updateComment,
        })
      );
      setIsEdit(!isEdit);
    }
  };

  const handleCommentDelete = (commentId: any) => {
    dispatch(fetchDeleteComment(commentId));
  };

  return (
    <div className="flex flex-col space-y-3 w-full">
      {userInfo && (
        <CardFooter className="w-full flex flex-col space-y-3">
          <div className="grid grid-cols-1 gap-4 w-full">
            <Label htmlFor="comment" className="text-muted-foreground">
              Add a Comment
            </Label>
            <Textarea
              id="comment"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
              className="w-full resize-none"
              rows={5}
            />
          </div>
          <Button className="w-full" size="sm" onClick={handleComment}>
            <MessageSquarePlus className="mr-2 h-4 md:h-5 w-4 md:w-5" />
            Add
          </Button>
        </CardFooter>
      )}
      {getCommentsStatus === "loading" || getCommentsStatus === "idle" ? (
        <p>Loading</p>
      ) : getCommentsStatus === "failed" ? (
        <p>{getCommentsError}</p>
      ) : (
        <>
          {comments.length > 0 ? (
            <CardFooter className="w-full flex flex-col space-y-3">
              <h1 className="text-lg font-semibold">Comments</h1>
              {comments.map((comment: any) => (
                <div
                  key={comment._id}
                  className="flex flex-col space-y-3  bg-muted w-full rounded-lg p-4"
                >
                  <div className="flex justify-between">
                    <div className="flex space-x-2">
                      <Link to={`/profile/${comment._id}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={comment.avatar} />
                          <AvatarFallback>P</AvatarFallback>
                        </Avatar>
                      </Link>
                      <Link to={`/profile/${comment._id}`}>
                        <h3 className="text-sm md:text-base font-semibold">
                          {comment.username}
                        </h3>
                      </Link>
                    </div>
                    {userInfo._id === comment.user && (
                      <div className="flex space-x-2">
                        <Button
                          className="w-8 h-8 hover:bg-background/40"
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            handleEditButton({
                              id: comment._id,
                              comment: comment.comment,
                            })
                          }
                        >
                          {isEdit ? (
                            <X className="w-6 h-6" />
                          ) : (
                            <Pencil className="w-6 h-6" />
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              className="w-8 h-8"
                              size="icon"
                              variant="destructive"
                            >
                              <Trash className="w-6 h-6" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your Comment and remove data
                                from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleCommentDelete(comment._id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                  {isEdit && comment._id === editId ? (
                    <div className="flex flex-col space-y-2">
                      <Textarea
                        id="comment-edit"
                        required
                        value={updateComment}
                        onChange={(e) => setUpdateComment(e.target.value)}
                        placeholder="Add a comment"
                        className="w-full resize-none bg-background"
                        rows={5}
                      />
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={() => handleCommentEdit(comment._id)}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <p>{comment.comment}</p>
                  )}
                </div>
              ))}
            </CardFooter>
          ) : (
            <p className="text-center text-lg font-semibold mb-4">
              No comments yet
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Comments;
