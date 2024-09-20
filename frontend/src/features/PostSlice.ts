import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./Proxy";

export const fetchCreatePost = createAsyncThunk(
  "create/post",
  async (post: any, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/posts/create`,
        post,
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

export const fetchPostDetails = createAsyncThunk(
  "post/postDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/posts/details/${id}`,
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

const postSlice = createSlice({
  name: "post",
  initialState: {
    createPost: {},
    createPostStatus: "idle",
    createPostError: {},

    postDetails: {},
    postDetailsStatus: "idle",
    postDetailsError: {},
  },
  reducers: {
    resetCreatePost: (state) => {
      state.createPost = {};
      state.createPostStatus = "idle";
      state.createPostError = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreatePost.pending, (state) => {
        state.createPostStatus = "loading";
      })
      .addCase(fetchCreatePost.fulfilled, (state, action) => {
        state.createPostStatus = "succeeded";
        state.createPost = action.payload;
      })
      .addCase(fetchCreatePost.rejected, (state, action) => {
        state.createPostStatus = "failed";
        state.createPostError = action.payload || "Create post failed";
      })

      .addCase(fetchPostDetails.pending, (state) => {
        state.postDetailsStatus = "loading";
      })
      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        state.postDetailsStatus = "succeeded";
        state.postDetails = action.payload;
      })
      .addCase(fetchPostDetails.rejected, (state, action) => {
        state.postDetailsStatus = "failed";
        state.postDetailsError = action.payload || "Post details failed";
      });
  },
});

export default postSlice.reducer;
