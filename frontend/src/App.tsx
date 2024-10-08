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
      <Route path="*" element={<PageNotFound />} />
      <Route index element={<HomePage />} />
      <Route path="/sign-up" element={<GoogleAuthWrapperSignUp />} />
      <Route path="/sign-in" element={<GoogleAuthWrapperSignIn />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />
      <Route path="/update-profile/:userId" element={<UpdateProfilePage />} />
      <Route path="/create-post" element={<CreatePostPage />} />
      <Route path="/post/:id" element={<PostDetailsPage />} />
      <Route path="/post/update/:id" element={<UpdatePostPage />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route
        path="/forgot-password/:userId?/:token?"
        element={<ForgotPassword />}
      />
      <Route path="/token-expired" element={<TokenExpired />} />
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
