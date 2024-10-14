import { useSelector, useDispatch } from "react-redux";
import { fetchAdmin, fetchAllUsers, resetAdmin } from "@/features/AdminSlice";
import { useEffect } from "react";

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
import { Check, Loader2, Trash2, UserMinus2, UserPlus2, X } from "lucide-react";
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

interface user {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
  totalFollowers: number;
  totalFollowing: number;
  totalPosts: number;
}

function AdminUsersListPage() {
  const dispatch = useDispatch<any>();

  const allUsers = useSelector((state: any) => state.admin.allUsers);
  const allUsersData = allUsers.data || {};
  const userList = allUsersData.docs || [];

  const adminStatus = useSelector((state: any) => state.admin.adminStatus);

  useEffect(() => {
    if (userList.length === 0) {
      dispatch(fetchAllUsers());
    }
  }, []);

  const admin = (id: string, isAdmin: boolean) => {
    const adminPromise = dispatch(fetchAdmin(id)).unwrap();

    toast.promise(adminPromise, {
      loading: isAdmin ? "Removing admin..." : "Adding admin...",
      success: (data: any) => {
        dispatch(fetchAllUsers());
        dispatch(resetAdmin());
        return data.message;
      },
      error: (error: any) => {
        dispatch(resetAdmin());
        return error || error.message;
      },
    });
  };

  return (
    <div className="min-h-[85vh] w-[98%] md:w-[95%] mx-auto flex justify-center items-center my-6">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="text-center hidden lg:table-cell">
              Following
            </TableHead>
            <TableHead className="text-center hidden lg:table-cell">
              Followers
            </TableHead>
            <TableHead className="text-center">Admin</TableHead>
            <TableHead className="text-center hidden md:table-cell">
              Make Admin
            </TableHead>
            <TableHead className="text-center hidden sm:table-cell">
              Delete
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.map((user: user) => (
            <TableRow key={user._id}>
              <TableCell>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm">{user.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.fullName}
                  </p>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {user.email}
              </TableCell>
              <TableCell className="text-center hidden lg:table-cell">
                <Badge className="hover:cursor-default">
                  {user.totalFollowing}
                </Badge>
              </TableCell>
              <TableCell className="text-center hidden lg:table-cell">
                <Badge className="hover:cursor-default">
                  {user.totalFollowers}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {user.isAdmin ? (
                  <Check className="text-emerald-500 mx-auto" />
                ) : (
                  <X className="text-red-500 mx-auto" />
                )}
              </TableCell>
              <TableCell className="text-center hidden md:table-cell">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" disabled={adminStatus === "loading"}>
                      {adminStatus === "loading" ? (
                        <Loader2 className="animate-spin" />
                      ) : user.isAdmin ? (
                        <UserMinus2 />
                      ) : (
                        <UserPlus2 />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {user.isAdmin
                          ? `This action make ${user.fullName} remove from admin
                          privilege. You can also add admin privilege.`
                          : ` This action make ${user.fullName} admin. You can also
                          remove admin privilege.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => admin(user._id, user.isAdmin)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
              <TableCell className="text-center hidden sm:table-cell">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="destructive">
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete {user.username} account and remove your data from
                        our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminUsersListPage;
