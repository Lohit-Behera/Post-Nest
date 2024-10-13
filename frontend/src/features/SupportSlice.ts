import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./Proxy";

interface details {
  name: string;
  email: string;
  message: string;
  subject: string;
  userId?: string | null;
  postId?: string | null;
}

export const fetchSupport = createAsyncThunk(
  "support/support",
  async (details: details, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.put(
        `${baseUrl}/api/v1/support/create`,
        details,
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

const supportSlice = createSlice({
  name: "support",
  initialState: {
    support: {},
    supportStatus: "idle",
    supportError: {},
  },
  reducers: {
    resetSupport: (state) => {
      state.support = {};
      state.supportStatus = "idle";
      state.supportError = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupport.pending, (state) => {
        state.supportStatus = "loading";
      })
      .addCase(fetchSupport.fulfilled, (state, action) => {
        state.supportStatus = "succeeded";
        state.support = action.payload;
      })
      .addCase(fetchSupport.rejected, (state, action) => {
        state.supportStatus = "failed";
        state.supportError = action.payload || "Support failed";
      });
  },
});

export const { resetSupport } = supportSlice.actions;
export default supportSlice.reducer;
