import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import {
  fetchAdminDeletePost,
  fetchAllPostsAdmin,
} from "@/features/AdminSlice";
import { Trash2 } from "lucide-react";
import Paginator from "@/components/paginator";
import AdminPostsListLoader from "@/components/Loader/AdminPostsListLoader";
import ServerErrorPage from "./Error/ServerErrorPage";

interface Post {
  _id: string;
  author: string;
  title: string;
  username: string;
  totalLikes: number;
  totalComments: number;
}
function AdminPostListPage() {
  const dispatch = useDispatch<any>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const allPosts = useSelector((state: any) => state.admin.allPosts);
  const allPostsData = allPosts.data || {};
  const postList = allPostsData.docs || [];
  const allPostsStatus = useSelector(
    (state: any) => state.admin.allPostsStatus
  );

  const [incorrectPage, setIncorrectPage] = useState(false);

  useEffect(() => {
    if (postList.length === 0) {
      dispatch(fetchAllPostsAdmin("1"));
      setIncorrectPage(false);
    } else if (
      parseInt(searchParams.get("page") || "1") > allPostsData.totalPages
    ) {
      setIncorrectPage(true);
    } else if (searchParams.get("page")) {
      dispatch(fetchAllPostsAdmin(searchParams.get("page") || "1"));
      setIncorrectPage(false);
    }
  }, [searchParams.get("page"), postList.length, dispatch]);

  const handleDeletePost = (id: string) => {
    const deletePostPromise = dispatch(fetchAdminDeletePost(id)).unwrap();

    toast.promise(deletePostPromise, {
      loading: "Deleting post...",
      success: (data: any) => {
        dispatch(fetchAllPostsAdmin("1"));
        return data.message;
      },
      error: (error: any) => {
        return error || error.message;
      },
    });
  };

  return (
    <>
      {allPostsStatus === "loading" || allPostsStatus === "idle" ? (
        <AdminPostsListLoader />
      ) : allPostsStatus === "failed" ? (
        <ServerErrorPage />
      ) : allPostsStatus === "succeeded" ? (
        <div className="min-h-[85vh] w-[98%] md:w-[95%] mx-auto flex justify-center items-center my-6">
          {incorrectPage ? (
            <div className="flex flex-col justify-center items-center gap-4 p-4 rounded-lg">
              <h1 className="text-xl font-bold">Incorrect Page</h1>
              <p className="text-lg">
                Please select a valid page or click below to go back page 1
              </p>
              <Button variant="outline" onClick={() => navigate("?page=1")}>
                1
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              <Table>
                <TableCaption>
                  <p className="text-start">
                    Showing {postList.length} of {allPostsData.totalDocs} posts
                  </p>
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead className="text-center hidden lg:table-cell">
                      Total Likes
                    </TableHead>
                    <TableHead className="text-center hidden lg:table-cell">
                      Total Comments
                    </TableHead>
                    <TableHead className="text-center hidden md:table-cell">
                      Delete
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {postList.map((post: Post) => (
                    <TableRow key={post._id}>
                      <TableCell className="text-xs md:text-sm font-medium">
                        <Link
                          to={`/post/${post._id}`}
                          className="hover:underline"
                        >
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs md:text-sm font-medium">
                        <Link
                          to={`/profile/${post.author}`}
                          className="hover:underline"
                        >
                          {post.username}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center hidden lg:table-cell">
                        <Badge className="hover:cursor-default">
                          {post.totalLikes}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center hidden lg:table-cell">
                        <Badge className="hover:cursor-default">
                          {post.totalComments}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete {post.title} and remove your
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDeletePost(post._id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="fixed bottom-14 w-full">
                {allPostsData.totalPages > 1 && (
                  <Paginator
                    currentPage={allPostsData.page}
                    totalPages={allPostsData.totalPages}
                    showPreviousNext
                  />
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}

export default AdminPostListPage;
