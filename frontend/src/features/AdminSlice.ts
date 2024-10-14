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
  },
  reducers: {
    resetAdmin: (state) => {
      state.admin = {};
      state.adminStatus = "idle";
      state.adminError = {};
    },
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;
