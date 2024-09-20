import { configureStore } from "@reduxjs/toolkit";

import ModeSlice from "@/features/ModeSlice";
import UserSlice from "@/features/UserSlice";
import PostSlice from "@/features/PostSlice";

const store = configureStore({
  reducer: {
    mode: ModeSlice,
    user: UserSlice,
    post: PostSlice,
  },
});

export default store;
