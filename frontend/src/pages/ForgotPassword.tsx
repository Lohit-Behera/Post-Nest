import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  fetchSendForgotPasswordEmail,
  fetchResetPassword,
  resetSendForgotPasswordEmail,
  resetResetPassword,
} from "@/features/UserSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CustomPassword from "@/components/CustomPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect } from "react";
import GlobalLoader from "@/components/Loader/GlobalLoader/GlobalLoader";

const EmailSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

const PasswordSchema = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

function ForgotPassword() {
  const { userId, token } = useParams();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const sendForgotPasswordEmailState = useSelector(
    (state: any) => state.user.sendForgotPasswordEmail
  );
  const resetPasswordStatus = useSelector(
    (state: any) => state.user.resetPasswordStatus
  );

  useEffect(() => {
    if (sendForgotPasswordEmailState === "succeeded") {
      navigate("/sign-in");
      dispatch(resetSendForgotPasswordEmail());
    } else if (sendForgotPasswordEmailState === "failed") {
      dispatch(resetSendForgotPasswordEmail());
    } else if (resetPasswordStatus === "succeeded") {
      navigate("/sign-in");
      dispatch(resetResetPassword());
    } else if (resetPasswordStatus === "failed") {
      dispatch(resetResetPassword());
    }
  }, [sendForgotPasswordEmailState, resetPasswordStatus]);

  const emailForm = useForm<z.infer<typeof EmailSchema>>({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof PasswordSchema>>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const submitEmail = (data: z.infer<typeof EmailSchema>) => {
    const sendEmailPromise = dispatch(
      fetchSendForgotPasswordEmail(data.email)
    ).unwrap();

    toast.promise(sendEmailPromise, {
      loading: "Sending email...",
      success: (data: any) => {
        return data.message;
      },
      error: (error: any) => {
        return error;
      },
    });
  };

  const submitPassword = (data: z.infer<typeof PasswordSchema>) => {
    const resetPasswordPromise = dispatch(
      fetchResetPassword({
        userId: userId as string,
        token: token as string,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
    ).unwrap();
    toast.promise(resetPasswordPromise, {
      loading: "Resetting password...",
      success: (data: any) => {
        return data.message;
      },
      error: (error: any) => {
        return error;
      },
    });
  };
  return (
    <>
      {sendForgotPasswordEmailState === "loading" ||
      resetPasswordStatus === "loading" ? (
        <GlobalLoader />
      ) : (
        <div className="max-w-sm min-h-[80vh] mx-auto flex justify-center">
          <div className="w-full my-auto rounded-lg border-2 p-2 md:p-4">
            {!userId || !token ? (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p>
                  {" "}
                  Enter your email and we'll send you a link to reset your
                  password.
                </p>
                <Form {...emailForm}>
                  <form
                    onSubmit={emailForm.handleSubmit(submitEmail)}
                    className="space-y-6"
                  >
                    <FormField
                      control={emailForm.control}
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
                    <Button type="submit" className="w-full">
                      Submit
                    </Button>
                  </form>
                </Form>
                <Button className="w-full" onClick={() => navigate("/sign-in")}>
                  Go Back
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p>Enter your new password.</p>
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(submitPassword)}
                    className="space-y-6"
                  >
                    <FormField
                      control={passwordForm.control}
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
                      control={passwordForm.control}
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
                    <Button type="submit" className="w-full">
                      Submit
                    </Button>
                  </form>
                </Form>
                <Button className="w-full" onClick={() => navigate("/sign-in")}>
                  Go Back
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ForgotPassword;
