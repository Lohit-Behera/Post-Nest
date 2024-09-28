import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchFollowingPosts,
  resetFollowingPosts,
  addPosts,
  addMorePosts,
  resetPosts,
} from "@/features/PostSlice";
import { useCallback, useEffect, useState } from "react";
import Post from "@/components/Post";
import { toast } from "sonner";
import { ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PostLoader from "@/components/Loader/PostLoader";

function HomePage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const useInfo = useSelector((state: any) => state.user.userInfo);
  const followingPosts =
    useSelector((state: any) => state.post.followingPosts) || [];
  const followingPostsStatus = useSelector(
    (state: any) => state.post.followingPostsStatus
  );
  const followingPostsError = useSelector(
    (state: any) => state.post.followingPostsError
  );

  const posts = useSelector((state: any) => state.post.posts);

  const [once, setOnce] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!useInfo) {
      navigate("/sign-in");
    } else {
      dispatch(resetPosts());
      setPage(1);
      setHasMore(false);
      dispatch(fetchFollowingPosts(page));
    }
  }, []);

  useEffect(() => {
    if (followingPostsStatus === "succeeded") {
      if (followingPosts.data.page === 1) {
        dispatch(addPosts(followingPosts.data.docs));
      } else {
        if (once) {
          dispatch(addMorePosts(followingPosts.data.docs));
          setOnce(false);
        }
      }
      setHasMore(followingPosts.data.hasNextPage);
      setPage(followingPosts.data.nextPage);
      dispatch(resetFollowingPosts());
    } else if (followingPostsStatus === "failed") {
      toast.error(followingPostsError);
    }
  }, [followingPostsStatus, dispatch]);

  const handleScroll = useCallback(() => {
    const scrollableHeight = document.documentElement.scrollHeight;
    const scrolledFromTop = window.innerHeight + window.scrollY;
    const scrollTrigger = (scrollableHeight * 90) / 100;

    if (Math.ceil(scrolledFromTop) > scrollTrigger) {
      if (hasMore) {
        setOnce(true);
        dispatch(fetchFollowingPosts(page));
      }
    }

    if (window.scrollY > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  }, [hasMore, dispatch, page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      {followingPostsStatus === "loading" && posts.length === 0 ? (
        <PostLoader />
      ) : followingPostsStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <>
          <div className="w-[98%] md:w-[95%] mx-auto my-6">
            {showScrollToTop && (
              <Button
                className="fixed bottom-10 right-10 rounded-full w-11 h-11 z-10"
                variant="secondary"
                onClick={scrollToTop}
                size="icon"
              >
                <ArrowUp />
              </Button>
            )}
            <Post posts={posts} followButton />
            {followingPostsStatus === "loading" && (
              <div className="flex justify-center mt-6">
                <Loader2 className="animate-spin w-14 h-14" />
              </div>
            )}
            {!hasMore && (
              <p className="text-center text-lg md:text-xl font-semibold mt-6">
                No more posts
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default HomePage;
