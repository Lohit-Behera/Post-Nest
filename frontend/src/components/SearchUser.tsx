import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, Search } from "lucide-react";
import { fetchSearchUser } from "@/features/UserSlice";

function SearchUser() {
  const dispatch = useDispatch<any>();
  const [username, setUsername] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  const searchUser = useSelector((state: any) => state.user.searchUser);
  const searchUserData = searchUser.data || [];
  const searchUserStatus = useSelector(
    (state: any) => state.user.searchUserStatus
  );
  const searchUserError = useSelector(
    (state: any) => state.user.searchUserError
  );

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username);
    }, 500);

    return () => {
      clearTimeout(timer); // Clear the timer if the user is still typing
    };
  }, [username]);

  // Dispatch search API when debouncedUsername changes
  useEffect(() => {
    if (debouncedUsername !== "") {
      dispatch(fetchSearchUser(debouncedUsername));
    }
  }, [debouncedUsername]);

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost" className="font-semibold">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search User</DialogTitle>
          <DialogDescription>
            Start typing to search for a user
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Username"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        {searchUserStatus === "loading" ? (
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
        ) : searchUserStatus === "succeeded" ? (
          <div>
            {searchUserData.length === 0 ? (
              <p className="text-center font-semibold ">No user found</p>
            ) : (
              <div className="space-y-2">
                {searchUserData.map((user: any) => (
                  <div
                    key={user._id}
                    className="flex justify-between space-x-2 bg-muted p-1 md:p-3 rounded-lg"
                  >
                    <div className="flex space-x-2">
                      <Link to={`/profile/${user._id}`}>
                        <Avatar className="w-10 h-10 outline-primary hover:outline outline-2  outline-offset-2">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.username ? user.username[0] : "A"}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex flex-col space-y-0.5">
                        <Link to={`/profile/${user._id}`}>
                          <p className="text-sm font-semibold hover:underline hover:cursor-pointer">
                            {user.username}
                          </p>
                        </Link>
                        <Link to={`/profile/${user._id}`}>
                          <p className="text-xs font-semibold hover:underline hover:cursor-pointer ">
                            {user.fullName}
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : searchUserStatus === "failed" ? (
          <p className="text-center font-semibold ">{searchUserError}</p>
        ) : null}
        <div></div>
      </DialogContent>
    </Dialog>
  );
}

export default SearchUser;
