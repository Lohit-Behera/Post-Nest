import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowUpRight,
  FileText,
  Heart,
  MessageCircle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAdminDashboard } from "@/features/AdminSlice";
import ServerErrorPage from "./Error/ServerErrorPage";
import AdminDashboardLoader from "@/components/Loader/AdminDashboardLoader";
import { Badge } from "@/components/ui/badge";

function AdminDashboard() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const adminDashboard = useSelector(
    (state: any) => state.admin.adminDashboard
  );
  const adminData = adminDashboard.data || {};
  const posts = adminData.posts || [];
  const support = adminData.support || [];
  const adminDashboardStatus = useSelector(
    (state: any) => state.admin.adminDashboardStatus
  );

  useEffect(() => {
    if (adminDashboardStatus === "idle" || adminDashboardStatus === "failed") {
      dispatch(fetchAdminDashboard());
    }
  }, [dispatch]);

  return (
    <>
      {adminDashboardStatus === "loading" ? (
        <AdminDashboardLoader />
      ) : adminDashboardStatus === "failed" ? (
        <ServerErrorPage />
      ) : (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 min-h-[93vh] w-full">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card x-chunk="dashboard-01-chunk-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Post
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <div className="text-2xl font-bold">{adminData.postsCount}</div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-sm"
                  onClick={() => navigate("/admin/posts")}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View all
                </Button>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total User
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <div className="text-2xl font-bold">{adminData.usersCount}</div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-sm"
                  onClick={() => navigate("/admin/users")}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View all
                </Button>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Comments
                </CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminData.commentsCount}
                </div>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Likes
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminData.likesCount}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
              <CardHeader className="flex flex-row items-center">
                <CardTitle>Recent Posts</CardTitle>
                <Button
                  size="sm"
                  className="ml-auto gap-1"
                  onClick={() => navigate("/admin/posts")}
                >
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">Title</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map(
                      (post: {
                        _id: string;
                        title: string;
                        author: string;
                        username: string;
                      }) => (
                        <TableRow key={post._id}>
                          <TableCell>
                            <Link
                              to={`/profile/${post.author}`}
                              className="hover:underline text-xs md:text-sm"
                            >
                              {post.username}
                            </Link>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              to={`/post/${post._id}`}
                              className="hover:underline text-xs md:text-sm"
                            >
                              {post.title}
                            </Link>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-5">
              <CardHeader>
                <CardTitle className="flex justify-between space-x-4">
                  <p>Recent Support Requests</p>
                  <Button
                    size="sm"
                    className="ml-auto gap-1"
                    onClick={() => navigate("/admin/supports")}
                  >
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">Name</TableHead>
                      <TableHead className="text-center hidden sm:table-cell">
                        subject
                      </TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {support.map(
                      (support: {
                        _id: string;
                        name: string;
                        email: string;
                        subject: string;
                        status: string;
                      }) => (
                        <TableRow>
                          <TableCell className="text-left text-xs md:text-sm">
                            <Link
                              to={`/admin/support/${support._id}`}
                              className="hover:underline"
                            >
                              {support.name}
                            </Link>
                          </TableCell>
                          <TableCell className="text-center hidden sm:table-cell ">
                            <Link
                              to={`/admin/support/${support._id}`}
                              className="hover:underline"
                            >
                              {support.subject}
                            </Link>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              className={`hover:cursor-default text-black  ${
                                support.status === "Pending"
                                  ? "bg-muted-foreground hover:bg-muted-foreground/70"
                                  : support.status === "In Progress"
                                  ? "bg-blue-500 hover:bg-blue-500/70"
                                  : "bg-green-500 hover:bg-green-500/70"
                              }`}
                            >
                              {support.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
