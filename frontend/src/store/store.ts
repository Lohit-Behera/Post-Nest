import { configureStore } from "@reduxjs/toolkit";

import ModeSlice from "@/features/ModeSlice";
import UserSlice from "@/features/UserSlice";
import PostSlice from "@/features/PostSlice";
import FollowSlice from "@/features/FollowSlice";

const store = configureStore({
  reducer: {
    mode: ModeSlice,
    user: UserSlice,
    post: PostSlice,
    follow: FollowSlice,
  },
});

export default store;
