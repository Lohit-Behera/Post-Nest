import { ThemeProvider } from "@/components/theme-provider";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ProfilePage from "./pages/ProfilePage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import UpdatePostPage from "./pages/UpdatePostPage";
import FeedPage from "./pages/FeedPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import PageNotFound from "./pages/Error/PageNotFound";
import ForgotPassword from "./pages/ForgotPassword";
import TokenExpired from "./pages/TokenExpired";
import AdminDashboard from "./pages/AdminDashboard";
import SupportPage from "./pages/SupportPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminUsersListPage from "./pages/AdminUsersListPage";
import AdminPostListPage from "./pages/AdminPostListPage";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleAuthWrapperSignUp = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <SignUpPage />
    </GoogleOAuthProvider>
  );
};

const GoogleAuthWrapperSignIn = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <SignInPage />
    </GoogleOAuthProvider>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Public Routes */}
      <Route path="*" element={<PageNotFound />} />
      <Route path="/sign-up" element={<GoogleAuthWrapperSignUp />} />
      <Route path="/sign-in" element={<GoogleAuthWrapperSignIn />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />
      <Route path="/post/:id" element={<PostDetailsPage />} />
      <Route path="/token-expired" element={<TokenExpired />} />
      <Route path="/support" element={<SupportPage />} />
      <Route
        path="/forgot-password/:userId?/:token?"
        element={<ForgotPassword />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/update-profile/:userId"
        element={
          <ProtectedRoute>
            <UpdateProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-post"
        element={
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/post/update/:id"
        element={
          <ProtectedRoute>
            <UpdatePostPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsersListPage />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/posts"
        element={
          <AdminRoute>
            <AdminPostListPage />
          </AdminRoute>
        }
      />
    </Route>
  )
);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}></RouterProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}

export default App;
