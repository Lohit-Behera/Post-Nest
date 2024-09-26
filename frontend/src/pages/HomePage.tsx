import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFollowingPosts } from "@/features/PostSlice";
import { useEffect } from "react";
import { fetchFollowingList } from "@/features/FollowSlice";
import Post from "@/components/Post";

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
