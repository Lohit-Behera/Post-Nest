import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChangeSupportStatus,
  fetchSupportDetails,
} from "@/features/AdminSlice";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import CustomImage from "@/components/CustomImage";
import { toast } from "sonner";
import ServerErrorPage from "./Error/ServerErrorPage";
import GlobalLoader from "@/components/Loader/GlobalLoader/GlobalLoader";

function AdminSupportPage() {
  const dispatch = useDispatch<any>();
  const { supportId } = useParams();

  const supportDetails = useSelector(
    (state: any) => state.admin.supportDetails
  );
  const supportDetailsData = supportDetails.data || {};
  const support = supportDetailsData.support || {};
  const user = supportDetailsData.user || {};
  const post = supportDetailsData.post || {};
  const supportDetailsStatus = useSelector(
    (state: any) => state.admin.supportDetailsStatus
  );

  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    dispatch(fetchSupportDetails(supportId as string));
  }, [dispatch]);

  const handleStatusChange = () => {
    if (status === "") {
      toast.warning("Please select a status");
    } else if (status === support.status) {
      toast.warning("Please select a different status");
    } else {
      const statusPromise = dispatch(
        fetchChangeSupportStatus({
          supportId: supportId as string,
          status: status,
        })
      ).unwrap();

      toast.promise(statusPromise, {
        loading: "Changing status...",
        success: (data: any) => {
          dispatch(fetchSupportDetails(supportId as string));
          return data.message;
        },
        error: (error: any) => {
          return error || error.message;
        },
      });
    }
  };

  return (
    <>
      {supportDetailsStatus === "loading" || supportDetailsStatus === "idle" ? (
        <GlobalLoader fullHight />
      ) : supportDetailsStatus === "failed" ? (
        <ServerErrorPage />
      ) : supportDetailsStatus === "succeeded" ? (
        <div className="relative min-h-[85vh] w-[98%] md:w-[95%] mx-auto flex-grow md:flex justify-center space-x-0 md:space-x-4 space-y-4 md:space-y-0  my-6">
          <div className="flex flex-col space-y-4 w-full md:min-w-4/6">
            <Card>
              <CardHeader>
                <CardTitle>Support Details</CardTitle>
                <CardDescription>
                  Created at {format(support.createdAt || new Date(), "PPP")}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="grid">
                  <Label>Name</Label>
                  {support.name}
                </div>
                <div className="grid">
                  <Label>Email</Label>

                  <p className="text-sm md:text-base">{support.email}</p>
                </div>
                <div className="grid">
                  <Label>Subject</Label>
                  <p>{support.subject}</p>
                </div>
                <div className="grid">
                  <Label>Message</Label>
                  <p>{support.message}</p>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <span
                    className={`flex justify-center space-x-1 p-2 rounded-full w-32 ${
                      support?.status === "Pending"
                        ? "bg-gray-500/40"
                        : support?.status === "In Progress"
                        ? "bg-blue-500/40"
                        : "bg-green-500/40"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mt-[9px] ${
                        support?.status === "Pending"
                          ? "bg-gray-500"
                          : support?.status === "In Progress"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                    ></span>
                    <p>{support?.status}</p>
                  </span>
                </div>
              </CardContent>
              <CardFooter className="grid gap-4">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" onClick={handleStatusChange}>
                    Save
                  </Button>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
            {post._id && (
              <Card>
                <CardHeader>
                  <CardTitle>Post Details</CardTitle>
                  <CardDescription>
                    Created at {format(post.createdAt || new Date(), "PPP")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid">
                    <Label>Title</Label>
                    <p>{post.title}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>Thumbnail</Label>
                    <CustomImage
                      className="w-full"
                      src={post.thumbnail}
                      alt={post.title}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          {user._id && (
            <Card className="top-0 h-60 w-full md:w-2/6">
              <CardHeader>
                <CardTitle>User Details</CardTitle>
                <CardDescription>
                  Created at {format(user.createdAt || new Date(), "PPP")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-center space-y-1">
                <Avatar className="mx-auto w-14 h-14">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col ">
                  <p className="text-center">{user.username}</p>
                  <p className="text-center">{user.email}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </>
  );
}

export default AdminSupportPage;
