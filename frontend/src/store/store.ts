import { configureStore } from "@reduxjs/toolkit";

import ModeSlice from "@/features/ModeSlice";
import UserSlice from "@/features/UserSlice";

const store = configureStore({
  reducer: {
    mode: ModeSlice,
    user: UserSlice,
  },
});

export default store;
