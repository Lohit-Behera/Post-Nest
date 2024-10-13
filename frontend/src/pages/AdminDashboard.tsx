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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

function AdminDashboard() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const adminDashboard = useSelector(
    (state: any) => state.admin.adminDashboard
  );
  const adminData = adminDashboard.data || {};
  const posts = adminData.posts || [];
  const users = adminData.users || [];
  const adminDashboardStatus = useSelector(
    (state: any) => state.admin.adminDashboardStatus
  );

  useEffect(() => {
    dispatch(fetchAdminDashboard());
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
                <div className="text-2xl font-bold">{adminData.usersCount}</div>
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
                  onClick={() => navigate("/admin/posts")}
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
                <div className="grid gap-2">
                  <CardTitle>Recent Posts</CardTitle>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                  <Link to="#">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
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
                              className="hover:underline"
                            >
                              {post.username}
                            </Link>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              to={`/post/${post._id}`}
                              className="hover:underline"
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
                <CardTitle>Recent Created Users</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-8">
                {users.map(
                  (user: {
                    _id: string;
                    username: string;
                    fullName: string;
                    avatar: string;
                  }) => (
                    <div className="flex items-center gap-4" key={user._id}>
                      <Link to={`/profile/${user._id}`}>
                        <Avatar className="hidden h-9 w-9 sm:flex outline-primary hover:outline outline-2  outline-offset-2">
                          <AvatarImage src={user.avatar} alt="Avatar" />
                          <AvatarFallback>
                            {user.username ? user.username[0] : "A"}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="grid gap-1">
                        <Link to={`/profile/${user._id}`}>
                          <p className="text-sm font-medium leading-none hover:underline">
                            {user.fullName}
                          </p>
                        </Link>
                        <Link to={`/profile/${user._id}`}>
                          <p className="text-sm text-muted-foreground hover:underline">
                            {user.username}
                          </p>
                        </Link>
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
