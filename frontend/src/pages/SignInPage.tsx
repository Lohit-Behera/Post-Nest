import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGoogleLogin } from "@react-oauth/google";
import { fetchGoogleAuth, fetchLogin } from "@/features/UserSlice";
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
import { useEffect } from "react";
import { toast } from "sonner";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

function SignInPage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const userInfo = useSelector((state: any) => state.user.userInfo);
  const userInfoStatus = useSelector((state: any) => state.user.userInfoStatus);
  const userInfoError = useSelector((state: any) => state.user.userInfoError);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (userInfoStatus === "succeeded") {
      navigate("/");
    }
  }, [userInfoStatus]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const signInPromise = dispatch(
      fetchLogin({
        email: data.email,
        password: data.password,
      })
    ).unwrap();
    toast.promise(signInPromise, {
      loading: "Logging in...",
      success: (data: any) => {
        return data.message;
      },
      error: (error: any) => {
        return error;
      },
    });
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
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] ">
      <div className="flex items-center justify-center py-12 ">
        <div className="mx-auto grid w-[380px] gap-6 p-2 md:p-4 border-2 rounded-lg">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign In</h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials below to Sign Up to your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Username or Email" {...field} />
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
                    <div className="flex justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        to="/forget-password"
                        className="text-sm hover:underline"
                      >
                        Forget Password
                      </Link>
                    </div>
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
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
          <Button variant="outline" className="w-full" onClick={googleLogin}>
            Sign in with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block max-h-[110vh]">
        <a
          href="https://www.pexels.com/photo/waterfalls-surrounded-by-trees-2743287/"
          target="_blank"
        >
          <img
            src={waterFall}
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover grayscale hover:filter-none duration-300 ease-in-out"
          />
        </a>
      </div>
    </div>
  );
}

export default SignInPage;
