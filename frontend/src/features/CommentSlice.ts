import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./Proxy";

export const fetchCreateComment = createAsyncThunk(
  "create/comment",
  async (comment: { postId: string; comment: string }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/comments/create`,
        comment,
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

export const fetchGetComments = createAsyncThunk(
  "comments/getComments",
  async (postId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/comments/${postId}`,
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

export const fetchDeleteComment = createAsyncThunk(
  "delete/comment",
  async (id: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.delete(
        `${baseUrl}/api/v1/comments/delete/${id}`,
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

export const fetchUpdateComment = createAsyncThunk(
  "update/comment",
  async (comment: any, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.patch(
        `${baseUrl}/api/v1/comments/update`,
        comment,
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

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    createComment: {},
    createCommentStatus: "idle",
    createCommentError: {},

    getComments: {},
    getCommentsStatus: "idle",
    getCommentsError: {},

    deleteComment: {},
    deleteCommentStatus: "idle",
    deleteCommentError: {},

    updateComment: {},
    updateCommentStatus: "idle",
    updateCommentError: {},
  },
  reducers: {
    resetCreateComment: (state) => {
      state.createComment = {};
      state.createCommentStatus = "idle";
      state.createCommentError = {};
    },
    resetDeleteComment: (state) => {
      state.deleteComment = {};
      state.deleteCommentStatus = "idle";
      state.deleteCommentError = {};
    },
    resetUpdateComment: (state) => {
      state.updateComment = {};
      state.updateCommentStatus = "idle";
      state.updateCommentError = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCreateComment.pending, (state) => {
        state.createCommentStatus = "loading";
        state.createCommentError = {};
      })
      .addCase(fetchCreateComment.fulfilled, (state, action) => {
        state.createCommentStatus = "succeeded";
        state.createComment = action.payload;
      })
      .addCase(fetchCreateComment.rejected, (state, action) => {
        state.createCommentStatus = "failed";
        state.createCommentError = action.payload || "Create comment failed";
      })

      .addCase(fetchGetComments.pending, (state) => {
        state.getCommentsStatus = "loading";
        state.getCommentsError = {};
      })
      .addCase(fetchGetComments.fulfilled, (state, action) => {
        state.getCommentsStatus = "succeeded";
        state.getComments = action.payload;
      })
      .addCase(fetchGetComments.rejected, (state, action) => {
        state.getCommentsStatus = "failed";
        state.getCommentsError = action.payload || "Get comments failed";
      })

      .addCase(fetchDeleteComment.pending, (state) => {
        state.deleteCommentStatus = "loading";
        state.deleteCommentError = {};
      })
      .addCase(fetchDeleteComment.fulfilled, (state, action) => {
        state.deleteCommentStatus = "succeeded";
        state.deleteComment = action.payload;
      })
      .addCase(fetchDeleteComment.rejected, (state, action) => {
        state.deleteCommentStatus = "failed";
        state.deleteCommentError = action.payload || "Delete comment failed";
      })

      .addCase(fetchUpdateComment.pending, (state) => {
        state.updateCommentStatus = "loading";
        state.updateCommentError = {};
      })
      .addCase(fetchUpdateComment.fulfilled, (state, action) => {
        state.updateCommentStatus = "succeeded";
        state.updateComment = action.payload;
      })
      .addCase(fetchUpdateComment.rejected, (state, action) => {
        state.updateCommentStatus = "failed";
        state.updateCommentError = action.payload || "Update comment failed";
      });
  },
});

export const { resetCreateComment, resetDeleteComment, resetUpdateComment } =
  commentSlice.actions;

export default commentSlice.reducer;
