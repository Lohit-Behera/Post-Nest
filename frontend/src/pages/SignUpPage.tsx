import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import waterFall from "@/assets/waterfalls.jpg";
import CustomPassword from "@/components/CustomPassword";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegister, fetchGoogleAuth } from "@/features/UserSlice";
import { useEffect } from "react";
import { toast } from "sonner";
import GlobalLoader from "@/components/Loader/GlobalLoader/GlobalLoader";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  avatar: z
    .any()
    .refine((file) => file instanceof File, { message: "Avatar is required." })
    .refine((file) => file?.size <= 3 * 1024 * 1024, {
      message: "Avatar size must be less than 5MB.",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file?.type),
      {
        message: "Only .jpg, .png, and .gif formats are supported.",
      }
    ),
});

function SignUpPage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const userInfo = useSelector((state: any) => state.user.userInfo);

  const register = useSelector((state: any) => state.user.register);
  const registerStatus = useSelector((state: any) => state.user.registerStatus);
  const registerError = useSelector((state: any) => state.user.registerError);
  const googleAuthStatus = useSelector(
    (state: any) => state.user.googleAuthStatus
  );
  const googleAuthError = useSelector(
    (state: any) => state.user.googleAuthError
  );

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo]);

  useEffect(() => {
    if (registerStatus === "succeeded") {
      navigate("/sign-in");
    } else if (googleAuthStatus === "succeeded") {
      toast.success("Login successful");
      navigate("/");
    } else if (googleAuthStatus === "failed") {
      toast.error(googleAuthError);
    }
  }, [register, registerStatus, registerError, googleAuthStatus, navigate]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const userData = {
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      avatar: data.avatar,
    };
    if (data.password !== data.confirmPassword) {
      toast.warning("Passwords do not match.");
    } else {
      const registerPromise = dispatch(fetchRegister(userData)).unwrap();
      toast.promise(registerPromise, {
        loading: "Registering...",
        success: (data: any) => {
          return data.message;
        },
        error: (error: any) => {
          return error;
        },
      });
    }
  }

  const responseGoogle = (authResponse: any) => {
    try {
      dispatch(fetchGoogleAuth(authResponse.code));
    } catch (error) {
      toast.error("Failed to Sign Up with Google. Please try again later.");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <>
      {googleAuthStatus === "loading" ? (
        <GlobalLoader fullHight={true} />
      ) : (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
          <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[400px] gap-6">
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Sign Up</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your credentials below to Sign Up to your account
                </p>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <CustomPassword
                            placeholder="Password"
                            {...field}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <CustomPassword
                            placeholder="Confirm Password"
                            {...field}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0] || null)
                            }
                            placeholder="Avatar"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              </Form>
              <Button
                variant="outline"
                className="w-full"
                onClick={googleLogin}
              >
                Sign Up with Google
              </Button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/sign-in" className="underline">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden bg-muted lg:block">
            <img
              src={waterFall}
              alt="Image"
              width="1920"
              height="1080"
              className="h-full w-full object-cover grayscale hover:grayscale-0 duration-700 ease-in-out"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default SignUpPage;
