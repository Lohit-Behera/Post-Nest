import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./Proxy";

export const fetchAdminDashboard = createAsyncThunk(
  "admin/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/admin/dashboard`,
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

export const fetchAllUsers = createAsyncThunk(
  "admin/users",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(`${baseUrl}/api/v1/admin/users`, config);
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

export const fetchAdmin = createAsyncThunk(
  "admin/admin",
  async (userId: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.patch(
        `${baseUrl}/api/v1/admin/make/${userId}`,
        {},
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

export const fetchDeleteUser = createAsyncThunk(
  "delete/user",
  async (id: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.delete(
        `${baseUrl}/api/v1/admin/delete/${id}`,
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

export const fetchAllPostsAdmin = createAsyncThunk(
  "admin/posts",
  async (page: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/admin/posts?page=${page}`,
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

export const fetchAdminDeletePost = createAsyncThunk(
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
        `${baseUrl}/api/v1/admin/delete/post/${id}`,
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

export const fetchGetAllSupportTickets = createAsyncThunk(
  "admin/support",
  async (page: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/admin/supports?page=${page}`,
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

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    adminDashboard: {},
    adminDashboardStatus: "idle",
    adminDashboardError: {},

    allUsers: {},
    allUsersStatus: "idle",
    allUsersError: {},

    admin: {},
    adminStatus: "idle",
    adminError: {},

    deleteUser: {},
    deleteUserStatus: "idle",
    deleteUserError: {},

    allPosts: {},
    allPostsStatus: "idle",
    allPostsError: {},

    adminDeletePost: {},
    adminDeletePostStatus: "idle",
    adminDeletePostError: {},

    getAllSupportTickets: {},
    getAllSupportTicketsStatus: "idle",
    getAllSupportTicketsError: {},
  },
  reducers: {
    resetAdmin: (state) => {
      state.admin = {};
      state.adminStatus = "idle";
      state.adminError = {};
    },
    resetDeleteUser: (state) => {
      state.deleteUser = {};
      state.deleteUserStatus = "idle";
      state.deleteUserError = {};
    },
    resetAdminDeletePost: (state) => {
      state.adminDeletePost = {};
      state.adminDeletePostStatus = "idle";
      state.adminDeletePostError = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin dashboard
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.adminDashboardStatus = "loading";
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.adminDashboardStatus = "succeeded";
        state.adminDashboard = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.adminDashboardStatus = "failed";
        state.adminDashboardError = action.payload || "Admin dashboard failed";
      })

      // All users
      .addCase(fetchAllUsers.pending, (state) => {
        state.allUsersStatus = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsersStatus = "succeeded";
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.allUsersStatus = "failed";
        state.allUsersError = action.payload || "All users failed";
      })

      // Admin
      .addCase(fetchAdmin.pending, (state) => {
        state.adminStatus = "loading";
      })
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        state.adminStatus = "succeeded";
        state.admin = action.payload;
      })
      .addCase(fetchAdmin.rejected, (state, action) => {
        state.adminStatus = "failed";
        state.adminError = action.payload || "Admin failed";
      })

      // Delete user
      .addCase(fetchDeleteUser.pending, (state) => {
        state.deleteUserStatus = "loading";
      })
      .addCase(fetchDeleteUser.fulfilled, (state, action) => {
        state.deleteUserStatus = "succeeded";
        state.deleteUser = action.payload;
      })
      .addCase(fetchDeleteUser.rejected, (state, action) => {
        state.deleteUserStatus = "failed";
        state.deleteUserError = action.payload || "Delete user failed";
      })

      // All posts
      .addCase(fetchAllPostsAdmin.pending, (state) => {
        state.allPostsStatus = "loading";
      })
      .addCase(fetchAllPostsAdmin.fulfilled, (state, action) => {
        state.allPostsStatus = "succeeded";
        state.allPosts = action.payload;
      })
      .addCase(fetchAllPostsAdmin.rejected, (state, action) => {
        state.allPostsStatus = "failed";
        state.allPostsError = action.payload || "All posts failed";
      })

      // Admin delete post
      .addCase(fetchAdminDeletePost.pending, (state) => {
        state.adminDeletePostStatus = "loading";
      })
      .addCase(fetchAdminDeletePost.fulfilled, (state, action) => {
        state.adminDeletePostStatus = "succeeded";
        state.adminDeletePost = action.payload;
      })
      .addCase(fetchAdminDeletePost.rejected, (state, action) => {
        state.adminDeletePostStatus = "failed";
        state.adminDeletePostError =
          action.payload || "Admin delete post failed";
      })

      // Get all support tickets
      .addCase(fetchGetAllSupportTickets.pending, (state) => {
        state.getAllSupportTicketsStatus = "loading";
      })
      .addCase(fetchGetAllSupportTickets.fulfilled, (state, action) => {
        state.getAllSupportTicketsStatus = "succeeded";
        state.getAllSupportTickets = action.payload;
      })
      .addCase(fetchGetAllSupportTickets.rejected, (state, action) => {
        state.getAllSupportTicketsStatus = "failed";
        state.getAllSupportTicketsError =
          action.payload || "Get all support tickets failed";
      });
  },
});

export const { resetAdmin, resetDeleteUser, resetAdminDeletePost } =
  adminSlice.actions;
export default adminSlice.reducer;
