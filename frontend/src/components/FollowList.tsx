import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import {
  fetchFollowersListWithDetails,
  fetchFollowingListWithDetails,
} from "@/features/FollowSlice";
import { toast } from "sonner";

function FollowList({
  userId,
  followNumber,
  text,
  following = false,
}: {
  userId: string;
  followNumber: number;
  text: string;
  following: boolean;
}) {
  //TODO show more users with pagination
  const dispatch = useDispatch<any>();

  const followingListWithDetails = useSelector(
    (state: any) => state.follow.followingListWithDetails
  );
  const followingListWithDetailsData = followingListWithDetails.data
    ? followingListWithDetails.data.docs
    : [];
  const followingListWithDetailsStatus = useSelector(
    (state: any) => state.follow.followingListWithDetailsStatus
  );
  const followingListWithDetailsError = useSelector(
    (state: any) => state.follow.followingListWithDetailsError
  );

  const followersListWithDetails = useSelector(
    (state: any) => state.follow.followersListWithDetails
  );
  const followersListWithDetailsData = followersListWithDetails.data
    ? followersListWithDetails.data.docs
    : [];
  const followersListWithDetailsStatus = useSelector(
    (state: any) => state.follow.followersListWithDetailsStatus
  );
  const followersListWithDetailsError = useSelector(
    (state: any) => state.follow.followersListWithDetailsError
  );

  const listOfUser = following
    ? followingListWithDetailsData
    : followersListWithDetailsData;

  useEffect(() => {
    if (following) {
      dispatch(fetchFollowingListWithDetails(userId));
    } else {
      dispatch(fetchFollowersListWithDetails(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (followingListWithDetailsStatus === "failed") {
      toast.error(followingListWithDetailsError);
    } else if (followersListWithDetailsStatus === "failed") {
      toast.error(followersListWithDetailsError);
    }
  }, [followingListWithDetailsStatus, followersListWithDetailsStatus]);

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div className="grid gap-0.5">
            <p className="text-sm text-center font-bold">{followNumber}</p>
            <p className="text-sm text-center font-semibold text-muted-foreground">
              {text}
            </p>
          </div>
        </DialogTrigger>
        <DialogContent>
          <ScrollArea className="max-h-[70vh] w-full h-full">
            <DialogHeader className="">
              <DialogTitle className="text-lg md:text-xl font-semibold text-center">
                {text}
              </DialogTitle>
              {followingListWithDetailsStatus === "loading" ||
              followersListWithDetailsStatus === "loading" ? (
                <>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-full h-full flex space-x-2 items-center"
                    >
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <Skeleton className="w-[50%] h-5 " />
                    </div>
                  ))}
                </>
              ) : followingListWithDetailsStatus === "failed" ||
                followersListWithDetailsStatus === "failed" ? (
                <p>Error...</p>
              ) : (
                <>
                  {listOfUser.length === 0 ? (
                    <p className="text-center">No {text} yet</p>
                  ) : (
                    <>
                      {listOfUser.map(
                        (user: {
                          _id: string;
                          username: string;
                          avatar: string;
                        }) => (
                          <div
                            key={user._id}
                            className="flex justify-between space-x-2 bg-muted p-1 md:p-3 rounded-lg"
                          >
                            <div className="flex space-x-2">
                              <Link to={`/profile/${user._id}`}>
                                <Avatar className="w-12 h-12 outline-primary hover:outline outline-2  outline-offset-2">
                                  <AvatarImage src={user.avatar} />
                                  <AvatarFallback>
                                    {user.username ? user.username[0] : "A"}
                                  </AvatarFallback>
                                </Avatar>
                              </Link>
                              <Link to={`/profile/${user._id}`}>
                                <p className="text-base md:text-lg font-semibold hover:underline hover:cursor-pointer">
                                  {user.username}
                                </p>
                              </Link>
                            </div>
                          </div>
                        )
                      )}
                    </>
                  )}
                </>
              )}
            </DialogHeader>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default FollowList;
