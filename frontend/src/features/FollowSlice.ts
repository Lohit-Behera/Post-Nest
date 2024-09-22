import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./Proxy";

export const fetchFollow = createAsyncThunk(
  "follow/follow",
  async (id: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/follow/${id}`,
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

export const fetchFollowingList = createAsyncThunk(
  "follow/followingList",
  async (id: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/follow/following/${id}`,
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

export const fetchFollowersList = createAsyncThunk(
  "follow/followersList",
  async (id: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/follow/followers/${id}`,
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

const followSlice = createSlice({
  name: "follow",
  initialState: {
    follow: {},
    followStatus: "idle",
    followError: {},

    followingList: {},
    followingListStatus: "idle",
    followingListError: {},

    followersList: {},
    followersListStatus: "idle",
    followersListError: {},
  },
  reducers: {
    resetFollow: (state) => {
      state.follow = {};
      state.followStatus = "idle";
      state.followError = {};
    },
    resetFollowingList: (state) => {
      state.followingList = {};
      state.followingListStatus = "idle";
      state.followingListError = {};
    },
    resetFollowersList: (state) => {
      state.followersList = {};
      state.followersListStatus = "idle";
      state.followersListError = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollow.pending, (state) => {
        state.followStatus = "loading";
      })
      .addCase(fetchFollow.fulfilled, (state, action) => {
        state.followStatus = "succeeded";
        state.follow = action.payload;
      })
      .addCase(fetchFollow.rejected, (state, action) => {
        state.followStatus = "failed";
        state.followError = action.payload || "Follow failed";
      })

      .addCase(fetchFollowingList.pending, (state) => {
        state.followingListStatus = "loading";
      })
      .addCase(fetchFollowingList.fulfilled, (state, action) => {
        state.followingListStatus = "succeeded";
        state.followingList = action.payload;
      })
      .addCase(fetchFollowingList.rejected, (state, action) => {
        state.followingListStatus = "failed";
        state.followingListError = action.payload || "Following list failed";
      })

      .addCase(fetchFollowersList.pending, (state) => {
        state.followersListStatus = "loading";
      })
      .addCase(fetchFollowersList.fulfilled, (state, action) => {
        state.followersListStatus = "succeeded";
        state.followersList = action.payload;
      })
      .addCase(fetchFollowersList.rejected, (state, action) => {
        state.followersListStatus = "failed";
        state.followersListError = action.payload || "Followers list failed";
      });
  },
});

export const { resetFollow, resetFollowingList, resetFollowersList } =
  followSlice.actions;
export default followSlice.reducer;
