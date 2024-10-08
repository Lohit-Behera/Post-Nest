import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "./Proxy";

export const fetchRegister = createAsyncThunk(
  "user/register",
  async (user: any, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/users/register`,
        user,
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

export const fetchLogin = createAsyncThunk(
  "user/login",
  async (user: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/users/login`,
        user,
        config
      );

      document.cookie = `userInfoPostNest=${encodeURIComponent(
        JSON.stringify(data.data)
      )}; path=/; max-age=${30 * 24 * 60 * 60}; secure; sameSite=None;`;
      return data.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchLogout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/users/logout`,
        {},
        config
      );
      document.cookie =
        "userInfoPostNest=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
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

export const fetchUserDetails = createAsyncThunk(
  "user/userDetails",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/v1/users/details`, {
        withCredentials: true,
      });

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

export const fetchSendVerifyEmail = createAsyncThunk(
  "user/sendVerifyEmail",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/users/send-verify-email`,
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

// Get user info for everyone
export const fetchGetUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (id: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/users/user-details/${id}`,
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

export const fetchUpdateUserDetails = createAsyncThunk(
  "user/updateUserDetails",
  async (user: any, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      const { data } = await axios.patch(
        `${baseUrl}/api/v1/users/update/${user.id}`,
        user,
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

export const fetchChangePassword = createAsyncThunk(
  "user/changePassword",
  async (user: any, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.patch(
        `${baseUrl}/api/v1/users/change-password`,
        user,
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

export const fetchGoogleAuth = createAsyncThunk(
  "user/googleAuth",
  async (token: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${baseUrl}/api/v1/users/auth/google?token=${token}`,
        config
      );
      if (data.data) {
        document.cookie = `userInfoPostNest=${encodeURIComponent(
          JSON.stringify(data.data)
        )}; path=/; max-age=${30 * 24 * 60 * 60}; secure;`;
      }
      return data.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchSearchUser = createAsyncThunk(
  "user/searchUser",
  async (username: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/users/search`,
        { username },
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

export const fetchSendForgotPasswordEmail = createAsyncThunk(
  "user/sendForgotPasswordEmail",
  async (email: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${baseUrl}/api/v1/users//send/forgot-password/mail`,
        { email },
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

export const fetchResetPassword = createAsyncThunk(
  "user/resetPassword",
  async (
    {
      userId,
      token,
      password,
      confirmPassword,
    }: {
      userId: string;
      token: string;
      password: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.patch(
        `${baseUrl}/api/v1/users/forgot-password/${userId}/${token}`,
        { password, confirmPassword },
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

export const fetchChangeUsername = createAsyncThunk(
  "user/changeUsername",
  async (username: string, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.patch(
        `${baseUrl}/api/v1/users/change-username`,
        { username },
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

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length > 1) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
}

const userInfoCookie = getCookie("userInfoPostNest");

const userSlice = createSlice({
  name: "user",
  initialState: {
    register: {},
    registerStatus: "idle",
    registerError: {},

    userInfo: userInfoCookie ? JSON.parse(userInfoCookie) : null,
    userInfoStatus: "idle",
    userInfoError: {},

    logout: {},
    logoutStatus: "idle",
    logoutError: {},

    userDetails: {},
    userDetailsStatus: "idle",
    userDetailsError: {},

    sendVerifyEmail: {},
    sendVerifyEmailStatus: "idle",
    sendVerifyEmailError: {},

    getUserInfo: {},
    getUserInfoStatus: "idle",
    getUserInfoError: {},

    updateUserDetails: {},
    updateUserDetailsStatus: "idle",
    updateUserDetailsError: {},

    changePassword: {},
    changePasswordStatus: "idle",
    changePasswordError: {},

    googleAuth: {},
    googleAuthStatus: "idle",
    googleAuthError: {},

    searchUser: {},
    searchUserStatus: "idle",
    searchUserError: {},

    sendForgotPasswordEmail: {},
    sendForgotPasswordEmailStatus: "idle",
    sendForgotPasswordEmailError: {},

    resetPassword: {},
    resetPasswordStatus: "idle",
    resetPasswordError: {},

    changeUsername: {},
    changeUsernameStatus: "idle",
    changeUsernameError: {},
  },
  reducers: {
    resetUserUpdate: (state) => {
      state.updateUserDetails = {};
      state.updateUserDetailsStatus = "idle";
      state.updateUserDetailsError = {};
    },
    resetRegister: (state) => {
      state.register = {};
      state.registerStatus = "idle";
      state.registerError = {};
    },
    resetChangePassword: (state) => {
      state.changePassword = {};
      state.changePasswordStatus = "idle";
      state.changePasswordError = {};
    },
    resetSendForgotPasswordEmail: (state) => {
      state.sendForgotPasswordEmail = {};
      state.sendForgotPasswordEmailStatus = "idle";
      state.sendForgotPasswordEmailError = {};
    },
    resetResetPassword: (state) => {
      state.resetPassword = {};
      state.resetPasswordStatus = "idle";
      state.resetPasswordError = {};
    },
    resetUserDetails: (state) => {
      state.userDetails = {};
      state.userDetailsStatus = "idle";
      state.userDetailsError = {};
    },
    resetChangeUsername: (state) => {
      state.changeUsername = {};
      state.changeUsernameStatus = "idle";
      state.changeUsernameError = {};
    },
    reSignIn: (state) => {
      state.userInfo = null;
      document.cookie =
        "userInfoPostNest=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    },
  },
  extraReducers: (builder) => {
    builder

      // Register
      .addCase(fetchRegister.pending, (state) => {
        state.registerStatus = "loading";
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.registerStatus = "succeeded";
        state.register = action.payload;
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.registerError = action.payload || "Register failed";
      })

      // Login
      .addCase(fetchLogin.pending, (state) => {
        state.userInfoStatus = "loading";
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.userInfoStatus = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.userInfoStatus = "failed";
        state.userInfoError = action.payload || "Login failed";
      })

      // Logout
      .addCase(fetchLogout.pending, (state) => {
        state.logoutStatus = "loading";
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        state.logoutStatus = "succeeded";
        state.logout = action.payload;
        state.userInfo = null;
      })
      .addCase(fetchLogout.rejected, (state, action) => {
        state.logoutStatus = "failed";
        state.logoutError = action.payload || "Logout failed";
      })

      // User Details
      .addCase(fetchUserDetails.pending, (state) => {
        state.userDetailsStatus = "loading";
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.userDetailsStatus = "succeeded";
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.userDetailsStatus = "failed";
        state.userDetailsError = action.payload || "User Details failed";
      })

      // Send Verify Email
      .addCase(fetchSendVerifyEmail.pending, (state) => {
        state.sendVerifyEmailStatus = "loading";
      })
      .addCase(fetchSendVerifyEmail.fulfilled, (state, action) => {
        state.sendVerifyEmailStatus = "succeeded";
        state.sendVerifyEmail = action.payload;
      })
      .addCase(fetchSendVerifyEmail.rejected, (state, action) => {
        state.sendVerifyEmailStatus = "failed";
        state.sendVerifyEmailError =
          action.payload || "Send Verify Email failed";
      })

      // Get User Info
      .addCase(fetchGetUserInfo.pending, (state) => {
        state.getUserInfoStatus = "loading";
      })
      .addCase(fetchGetUserInfo.fulfilled, (state, action) => {
        state.getUserInfoStatus = "succeeded";
        state.getUserInfo = action.payload;
      })
      .addCase(fetchGetUserInfo.rejected, (state, action) => {
        state.getUserInfoStatus = "failed";
        state.getUserInfoError = action.payload || "Get User Info failed";
      })

      // Edit User Details
      .addCase(fetchUpdateUserDetails.pending, (state) => {
        state.updateUserDetailsStatus = "loading";
      })
      .addCase(fetchUpdateUserDetails.fulfilled, (state, action) => {
        state.updateUserDetailsStatus = "succeeded";
        state.updateUserDetails = action.payload;
      })
      .addCase(fetchUpdateUserDetails.rejected, (state, action) => {
        state.updateUserDetailsStatus = "failed";
        state.updateUserDetailsError =
          action.payload || "failed to update user details";
      })

      // Change Password
      .addCase(fetchChangePassword.pending, (state) => {
        state.changePasswordStatus = "loading";
      })
      .addCase(fetchChangePassword.fulfilled, (state, action) => {
        state.changePasswordStatus = "succeeded";
        state.changePassword = action.payload;
      })
      .addCase(fetchChangePassword.rejected, (state, action) => {
        state.changePasswordStatus = "failed";
        state.changePasswordError =
          action.payload || "failed to change password";
      })

      // google auth
      .addCase(fetchGoogleAuth.pending, (state) => {
        state.googleAuthStatus = "loading";
      })
      .addCase(fetchGoogleAuth.fulfilled, (state, action) => {
        state.googleAuthStatus = "succeeded";
        state.userInfo = action.payload;
        state.googleAuth = action.payload;
      })
      .addCase(fetchGoogleAuth.rejected, (state, action) => {
        state.googleAuthStatus = "failed";
        state.googleAuthError = action.payload || "Google auth failed";
      })

      // search user
      .addCase(fetchSearchUser.pending, (state) => {
        state.searchUserStatus = "loading";
      })
      .addCase(fetchSearchUser.fulfilled, (state, action) => {
        state.searchUserStatus = "succeeded";
        state.searchUser = action.payload;
      })
      .addCase(fetchSearchUser.rejected, (state, action) => {
        state.searchUserStatus = "failed";
        state.searchUserError = action.payload || "Search user failed";
      })

      // send password reset email
      .addCase(fetchSendForgotPasswordEmail.pending, (state) => {
        state.sendForgotPasswordEmailStatus = "loading";
      })
      .addCase(fetchSendForgotPasswordEmail.fulfilled, (state, action) => {
        state.sendForgotPasswordEmailStatus = "succeeded";
        state.sendForgotPasswordEmail = action.payload;
      })
      .addCase(fetchSendForgotPasswordEmail.rejected, (state, action) => {
        state.sendForgotPasswordEmailStatus = "failed";
        state.sendForgotPasswordEmailError =
          action.payload || "Send password forgot email failed";
      })

      // reset password
      .addCase(fetchResetPassword.pending, (state) => {
        state.resetPasswordStatus = "loading";
      })
      .addCase(fetchResetPassword.fulfilled, (state, action) => {
        state.resetPasswordStatus = "succeeded";
        state.resetPassword = action.payload;
      })
      .addCase(fetchResetPassword.rejected, (state, action) => {
        state.resetPasswordStatus = "failed";
        state.resetPasswordError = action.payload || "Reset password failed";
      })

      // Change Username
      .addCase(fetchChangeUsername.pending, (state) => {
        state.changeUsernameStatus = "loading";
      })
      .addCase(fetchChangeUsername.fulfilled, (state, action) => {
        state.changeUsernameStatus = "succeeded";
        state.changeUsername = action.payload;
      })
      .addCase(fetchChangeUsername.rejected, (state, action) => {
        state.changeUsernameStatus = "failed";
        state.changeUsernameError = action.payload || "Change username failed";
      });
  },
});

export const {
  resetUserUpdate,
  resetRegister,
  resetChangePassword,
  resetSendForgotPasswordEmail,
  resetResetPassword,
  reSignIn,
  resetUserDetails,
  resetChangeUsername,
} = userSlice.actions;
export default userSlice.reducer;
