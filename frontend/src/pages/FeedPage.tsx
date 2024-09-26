import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllPosts } from "@/features/PostSlice";
import { useEffect } from "react";
import Post from "@/components/Post";

function FeedPage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const useInfo = useSelector((state: any) => state.user.userInfo);
  const allPosts = useSelector((state: any) => state.post.allPosts);
  const posts = allPosts.data ? allPosts.data.docs : [];
  const allPostsStatus = useSelector((state: any) => state.post.allPostsStatus);

  useEffect(() => {
    if (!useInfo) {
      navigate("/sign-in");
    } else {
      dispatch(fetchAllPosts());
    }
  }, [useInfo, dispatch, navigate]);
  return (
    <>
      {allPostsStatus === "loading" || allPostsStatus === "idle" ? (
        <p>Loading</p>
      ) : allPostsStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <Post posts={posts} followButton />
      )}
    </>
  );
}

export default FeedPage;
