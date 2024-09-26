import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFollowingPosts } from "@/features/PostSlice";
import { useEffect } from "react";
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

  useEffect(() => {
    if (!useInfo) {
      navigate("/sign-in");
    } else {
      dispatch(fetchFollowingPosts());
    }
  }, []);
  return (
    <>
      {followingPostsStatus === "loading" || followingPostsStatus === "idle" ? (
        <p>Loading</p>
      ) : followingPostsStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <Post posts={posts} followButton />
      )}
    </>
  );
}

export default HomePage;
