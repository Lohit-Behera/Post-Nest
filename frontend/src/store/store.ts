import { configureStore } from "@reduxjs/toolkit";
import ModeSlice from "@/features/ModeSlice";

const store = configureStore({
    reducer: {
        mode: ModeSlice,
    }
})

export default store