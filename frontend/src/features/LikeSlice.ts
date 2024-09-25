import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./Proxy";

export const fetchLikeUnlike = createAsyncThunk(
  "like/unlike",
  async (likeUnlike: any, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.put(
        `${baseUrl}/api/v1/likes`,
        likeUnlike,
        config
      );
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchPostLikes = createAsyncThunk(
  "like/postLikes",
  async (postId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/likes/post/${postId}`,
        config
      );
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

const likeSlice = createSlice({
  name: "like",
  initialState: {
    likeUnlike: {},
    likeUnlikeStatus: "idle",
    likeUnlikeError: {},

    postLikes: {},
    postLikesStatus: "idle",
    postLikesError: {},
  },
  reducers: {
    resetLikeUnlike: (state) => {
      state.likeUnlike = {};
      state.likeUnlikeStatus = "idle";
      state.likeUnlikeError = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikeUnlike.pending, (state) => {
        state.likeUnlikeStatus = "loading";
      })
      .addCase(fetchLikeUnlike.fulfilled, (state, action) => {
        state.likeUnlikeStatus = "succeeded";
        state.likeUnlike = action.payload;
      })
      .addCase(fetchLikeUnlike.rejected, (state, action) => {
        state.likeUnlikeStatus = "failed";
        state.likeUnlikeError = action.payload || "Like/Unlike failed";
      })

      .addCase(fetchPostLikes.pending, (state) => {
        state.postLikesStatus = "loading";
      })
      .addCase(fetchPostLikes.fulfilled, (state, action) => {
        state.postLikesStatus = "succeeded";
        state.postLikes = action.payload;
      })
      .addCase(fetchPostLikes.rejected, (state, action) => {
        state.postLikesStatus = "failed";
        state.postLikesError = action.payload || "Post Likes failed";
      });
  },
});

export const { resetLikeUnlike } = likeSlice.actions;
export default likeSlice.reducer;
