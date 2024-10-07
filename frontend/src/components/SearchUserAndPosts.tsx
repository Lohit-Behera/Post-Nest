import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, Search } from "lucide-react";
import { fetchSearchUser } from "@/features/UserSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchSearchPosts } from "@/features/PostSlice";
import { toast } from "sonner";

function SearchUserAndPosts() {
  const dispatch = useDispatch<any>();
  const [username, setUsername] = useState("");
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [title, setTitle] = useState("");
  const [debouncedTitle, setDebouncedTitle] = useState("");

  const searchUser = useSelector((state: any) => state.user.searchUser);
  const searchUserData = searchUser.data || [];
  const searchUserStatus = useSelector(
    (state: any) => state.user.searchUserStatus
  );
  const searchUserError = useSelector(
    (state: any) => state.user.searchUserError
  );
  const searchPosts = useSelector((state: any) => state.post.searchPosts);
  const searchPostsData = searchPosts.data || [];
  console.log(searchPostsData);

  const searchPostsStatus = useSelector(
    (state: any) => state.post.searchPostsStatus
  );
  const searchPostsError = useSelector(
    (state: any) => state.post.searchPostsError
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username);
      setDebouncedTitle(title);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [username, title]);

  useEffect(() => {
    if (debouncedUsername !== "") {
      dispatch(fetchSearchUser(debouncedUsername));
    } else if (debouncedTitle !== "") {
      dispatch(fetchSearchPosts(debouncedTitle));
    }
  }, [debouncedUsername, debouncedTitle]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="font-semibold">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Start typing to search</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="user">
          <TabsList className="w-full">
            <TabsTrigger
              className="w-full font-semibold"
              value="user"
              onClick={() => {
                setUsername("");
                setTitle("");
              }}
            >
              User
            </TabsTrigger>
            <TabsTrigger
              className="w-full font-semibold"
              value="posts"
              onClick={() => {
                setUsername("");
                setTitle("");
              }}
            >
              Posts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            <>
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
                            <DialogClose asChild>
                              <Link to={`/profile/${user._id}`}>
                                <Avatar className="w-10 h-10 outline-primary hover:outline outline-2  outline-offset-2">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>
                                    {user.username ? user.username[0] : "A"}
                                  </AvatarFallback>
                                </Avatar>
                              </Link>
                            </DialogClose>
                            <div className="flex flex-col space-y-0.5">
                              <DialogClose asChild>
                                <Link to={`/profile/${user._id}`}>
                                  <p className="text-sm font-semibold hover:underline hover:cursor-pointer">
                                    {user.username}
                                  </p>
                                </Link>
                              </DialogClose>
                              <DialogClose asChild>
                                <Link to={`/profile/${user._id}`}>
                                  <p className="text-xs font-semibold hover:underline hover:cursor-pointer ">
                                    {user.fullName}
                                  </p>
                                </Link>
                              </DialogClose>
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
            </>
          </TabsContent>
          <TabsContent value="posts">
            <>
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="title"
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  autoComplete="off"
                />
              </div>
              {searchPostsStatus === "loading" ? (
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              ) : searchPostsStatus === "succeeded" ? (
                <>
                  {searchPostsData.length === 0 ? (
                    <p className="text-center font-semibold ">No Post found</p>
                  ) : (
                    <div className="space-y-2">
                      {searchPostsData.map(
                        (post: { _id: string; title: string }) => (
                          <div
                            key={post._id}
                            className="flex justify-between space-x-2 bg-muted p-1 md:p-3 rounded-lg"
                          >
                            <div className="flex space-x-2">
                              <DialogClose asChild>
                                <Link
                                  className="line-clamp-1 hover:underline"
                                  to={`/post/${post._id}`}
                                >
                                  {post.title}
                                </Link>
                              </DialogClose>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </>
              ) : searchPostsStatus === "failed" ? (
                <p className="text-center font-semibold ">{searchPostsError}</p>
              ) : null}
            </>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default SearchUserAndPosts;
