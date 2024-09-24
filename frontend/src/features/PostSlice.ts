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

export const fetchUpdatePost = createAsyncThunk(
  "update/post",
  async (post: any, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      const { data } = await axios.patch(
        `${baseUrl}/api/v1/posts/update/${post.id}`,
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

export const fetchDeletePost = createAsyncThunk(
  "delete/post",
  async (id: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.delete(
        `${baseUrl}/api/v1/posts/delete/${id}`,
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

export const fetchAllPosts = createAsyncThunk(
  "posts/allPosts",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(`${baseUrl}/api/v1/posts/all`, config);
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

export const fetchUserAllPosts = createAsyncThunk(
  "posts/userAllPosts",
  async (id: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/posts/user/all/${id}`,
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

export const fetchFollowingPosts = createAsyncThunk(
  "posts/followingPosts",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/posts//following/all`,
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

    updatePost: {},
    updatePostStatus: "idle",
    updatePostError: {},

    deletePost: {},
    deletePostStatus: "idle",
    deletePostError: {},

    allPosts: [],
    allPostsStatus: "idle",
    allPostsError: {},

    userAllPosts: [],
    userAllPostsStatus: "idle",
    userAllPostsError: {},

    followingPosts: [],
    followingPostsStatus: "idle",
    followingPostsError: {},
  },
  reducers: {
    resetCreatePost: (state) => {
      state.createPost = {};
      state.createPostStatus = "idle";
      state.createPostError = {};
    },
    resetUpdatePost: (state) => {
      state.updatePost = {};
      state.updatePostStatus = "idle";
      state.updatePostError = {};
    },
    resetDeletePost: (state) => {
      state.deletePost = {};
      state.deletePostStatus = "idle";
      state.deletePostError = {};
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
      })

      .addCase(fetchUpdatePost.pending, (state) => {
        state.updatePostStatus = "loading";
      })
      .addCase(fetchUpdatePost.fulfilled, (state, action) => {
        state.updatePostStatus = "succeeded";
        state.updatePost = action.payload;
      })
      .addCase(fetchUpdatePost.rejected, (state, action) => {
        state.updatePostStatus = "failed";
        state.updatePostError = action.payload || "Update post failed";
      })

      .addCase(fetchDeletePost.pending, (state) => {
        state.deletePostStatus = "loading";
      })
      .addCase(fetchDeletePost.fulfilled, (state, action) => {
        state.deletePostStatus = "succeeded";
        state.deletePost = action.payload;
      })
      .addCase(fetchDeletePost.rejected, (state, action) => {
        state.deletePostStatus = "failed";
        state.deletePostError = action.payload || "Delete post failed";
      })

      .addCase(fetchAllPosts.pending, (state) => {
        state.allPostsStatus = "loading";
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.allPostsStatus = "succeeded";
        state.allPosts = action.payload;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.allPostsStatus = "failed";
        state.allPostsError = action.payload || "All posts failed";
      })

      .addCase(fetchUserAllPosts.pending, (state) => {
        state.userAllPostsStatus = "loading";
      })
      .addCase(fetchUserAllPosts.fulfilled, (state, action) => {
        state.userAllPostsStatus = "succeeded";
        state.userAllPosts = action.payload;
      })
      .addCase(fetchUserAllPosts.rejected, (state, action) => {
        state.userAllPostsStatus = "failed";
        state.userAllPostsError = action.payload || "All posts failed";
      })

      .addCase(fetchFollowingPosts.pending, (state) => {
        state.followingPostsStatus = "loading";
      })
      .addCase(fetchFollowingPosts.fulfilled, (state, action) => {
        state.followingPostsStatus = "succeeded";
        state.followingPosts = action.payload;
      })
      .addCase(fetchFollowingPosts.rejected, (state, action) => {
        state.followingPostsStatus = "failed";
        state.followingPostsError = action.payload || "Following posts failed";
      });
  },
});

export const { resetCreatePost, resetUpdatePost, resetDeletePost } =
  postSlice.actions;

export default postSlice.reducer;
