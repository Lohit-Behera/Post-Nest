import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchFollowingPosts } from "@/features/PostSlice";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Post from "@/components/Post";
import { fetchFollowingList } from "@/features/FollowSlice";

function HomePage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const useInfo = useSelector((state: any) => state.user.userInfo);
  const followingPosts =
    useSelector((state: any) => state.post.followingPosts) || [];
  const posts = followingPosts.data ? followingPosts.data.docs : [];
  const followingPostsStatus = useSelector(
    (state: any) => state.post.followingPostsStatus
  );
  const followingList =
    useSelector((state: any) => state.follow.followingList) || {};
  const followingListData = followingList.data || [];

  useEffect(() => {
    if (!useInfo) {
      navigate("/sign-in");
    } else {
      dispatch(fetchFollowingPosts());
      dispatch(fetchFollowingList(useInfo._id));
    }
  }, []);
  return (
    <>
      {followingPostsStatus === "loading" || followingPostsStatus === "idle" ? (
        <p>Loading</p>
      ) : followingPostsStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <Post posts={posts} followingList={followingListData} followButton />
      )}
    </>
  );
}

export default HomePage;
