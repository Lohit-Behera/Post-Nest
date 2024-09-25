import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllPosts } from "@/features/PostSlice";
import { useEffect } from "react";
import Post from "@/components/Post";
import { fetchFollowingList } from "@/features/FollowSlice";

function FeedPage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const useInfo = useSelector((state: any) => state.user.userInfo);
  const allPosts = useSelector((state: any) => state.post.allPosts);
  const posts = allPosts.data ? allPosts.data.docs : [];
  const allPostsStatus = useSelector((state: any) => state.post.allPostsStatus);
  const followingList = useSelector((state: any) => state.follow.followingList);
  const followingListData = followingList.data || [];
  useEffect(() => {
    if (!useInfo) {
      navigate("/sign-in");
    } else {
      dispatch(fetchAllPosts());
      dispatch(fetchFollowingList(useInfo._id));
    }
  }, [useInfo, dispatch, navigate]);
  return (
    <>
      {allPostsStatus === "loading" || allPostsStatus === "idle" ? (
        <p>Loading</p>
      ) : allPostsStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <Post posts={posts} followingList={followingListData} followButton />
      )}
    </>
  );
}

export default FeedPage;
