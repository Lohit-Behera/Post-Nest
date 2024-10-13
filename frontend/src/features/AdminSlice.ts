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

export const adminSlice = createSlice({
  name: "admin",
  initialState: {
    adminDashboard: {},
    adminDashboardStatus: "idle",
    adminDashboardError: {},
  },
  reducers: {},
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
      });
  },
});

export default adminSlice.reducer;
