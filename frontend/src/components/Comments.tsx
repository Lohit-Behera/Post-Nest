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
import {
  Ban,
  Loader2,
  MessageSquarePlus,
  Pencil,
  Plus,
  Trash,
  X,
} from "lucide-react";
import {
  addComments,
  addMoreComments,
  fetchCreateComment,
  fetchDeleteComment,
  fetchGetComments,
  fetchUpdateComment,
  resetComments,
  resetCreateComment,
  resetDeleteComment,
  resetGetComments,
  resetUpdateComment,
} from "@/features/CommentSlice";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  comment: z
    .string()
    .min(2, { message: "Comment must be at least 2 characters." })
    .max(200, { message: "Comment must be less than 200 characters." }),
});
function Comments({ id }: any) {
  const dispatch = useDispatch<any>();

  const userInfo = useSelector((state: any) => state.user.userInfo);
  const createCommentStatus = useSelector(
    (state: any) => state.comment.createCommentStatus
  );
  const getComments = useSelector((state: any) => state.comment.getComments);
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

  // when i use useState to set comments state, it will runs twice
  const comments = useSelector((state: any) => state.comment.comments);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    dispatch(resetComments());
    setPage(1);
    setHasMore(true);
    dispatch(fetchGetComments({ postId: id, page: 1 }));
  }, [dispatch, id]);

  useEffect(() => {
    if (getCommentsStatus === "succeeded") {
      if (getComments.data.docs) {
        if (getComments.data.page === 1) {
          dispatch(addComments(getComments.data.docs));
        } else {
          dispatch(addMoreComments(getComments.data.docs));
        }
      }
      setPage(getComments.data.nextPage);
      setHasMore(getComments.data.hasNextPage);
      dispatch(resetGetComments());
    } else if (getCommentsStatus === "failed") {
      toast.error(getCommentsError);
    }
  }, [getCommentsStatus]);

  useEffect(() => {
    if (createCommentStatus === "succeeded") {
      dispatch(resetCreateComment());
      dispatch(fetchGetComments({ postId: id, page: 1 }));
    } else if (createCommentStatus === "failed") {
    } else if (updateCommentStatus === "succeeded") {
      dispatch(resetUpdateComment());
      dispatch(fetchGetComments({ postId: id, page: 1 }));
    } else if (updateCommentStatus === "failed") {
      dispatch(resetUpdateComment());
    }
  }, [createCommentStatus, updateCommentStatus]);

  useEffect(() => {
    if (deleteCommentStatus === "succeeded") {
      dispatch(fetchGetComments({ postId: id, page: 1 }));
      dispatch(resetDeleteComment());
    } else if (deleteCommentStatus === "failed") {
      dispatch(resetDeleteComment());
    }
  }, [deleteCommentStatus]);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [updateComment, setUpdateComment] = useState("");

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: "",
    },
  });

  const handleComment = (data: z.infer<typeof FormSchema>) => {
    const commentPromise = dispatch(
      fetchCreateComment({
        postId: id,
        comment: data.comment,
      })
    ).unwrap();
    toast.promise(commentPromise, {
      loading: "Creating comment...",
      success: (data: any) => {
        form.reset();
        return data.message;
      },
      error: (error: any) => {
        return error;
      },
    });
  };

  const handleEditButton = (userComment: any) => {
    setIsEdit(!isEdit);
    setEditId(userComment.id);
    setUpdateComment(userComment.comment);
  };

  const handleCommentEdit = (commentId: any) => {
    if (!updateComment) {
      toast.warning("Please write a comment");
    } else if (updateComment.length < 2) {
      toast.warning("Comment must be at least 2 characters");
    } else if (updateComment.length > 200) {
      toast.warning("Comment must be less than 200 characters");
    } else {
      const commentUpdatePromise = dispatch(
        fetchUpdateComment({
          commentId: commentId,
          comment: updateComment,
        })
      ).unwrap();
      toast.promise(commentUpdatePromise, {
        loading: "Updating comment...",
        success: (data: any) => {
          return data.message;
        },
        error: (error: any) => {
          return error;
        },
      });
      setIsEdit(!isEdit);
    }
  };

  const handleCommentDelete = (commentId: any) => {
    const commentDeletePromise = dispatch(
      fetchDeleteComment(commentId)
    ).unwrap();
    toast.promise(commentDeletePromise, {
      loading: "Deleting comment...",
      success: (data: any) => {
        return data.message;
      },
      error: (error: any) => {
        return error;
      },
    });
  };

  const handleLoadMore = () => {
    if (hasMore) {
      dispatch(fetchGetComments({ postId: id, page: page }));
    }
  };

  return (
    <div className="flex flex-col space-y-3 w-full">
      {userInfo && (
        <CardFooter className="w-full flex flex-col space-y-3">
          <div className="grid grid-cols-1 gap-4 w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleComment)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a comment"
                          className="w-full resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full" size="sm">
                  <MessageSquarePlus className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                  Add
                </Button>
              </form>
            </Form>
          </div>
        </CardFooter>
      )}
      {getCommentsStatus === "loading" && comments.length === 0 ? (
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
              {getCommentsStatus === "loading" && (
                <div className="flex justify-center items-center my-4">
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Loading...
                </div>
              )}
              <div className="flex justify-center items-center">
                <Button
                  size="sm"
                  disabled={!hasMore || getCommentsStatus === "loading"}
                  onClick={handleLoadMore}
                >
                  {hasMore ? (
                    <>
                      <Plus className="mr-2 w-4 h-4" />
                      Load more
                    </>
                  ) : (
                    <>
                      <Ban className="mr-2 w-4 h-4" />
                      No more comments
                    </>
                  )}
                </Button>
              </div>
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
