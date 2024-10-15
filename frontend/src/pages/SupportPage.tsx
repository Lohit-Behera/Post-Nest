import { useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { fetchSupport } from "@/features/SupportSlice";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must be less than 50 characters.",
    }),
  message: z
    .string()
    .min(2, {
      message: "Message must be at least 2 characters.",
    })
    .max(200, {
      message: "Message must be less than 200 characters.",
    }),
  subject: z
    .string()
    .min(2, {
      message: "Subject must be at least 2 characters.",
    })
    .max(50, {
      message: "Subject must be less than 50 characters.",
    }),
});

function SupportPage() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<any>();
  const userInfo = useSelector((state: any) => state.user.userInfo);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userInfo.email || "",
      name: userInfo.username || "",
      message: "",
      subject: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    const supportPromise = dispatch(
      fetchSupport({
        email: values.email,
        name: values.name,
        message: values.message,
        subject: values.subject,
        userId: userInfo._id || null,
        postId: searchParams.get("postId"),
      })
    ).unwrap();

    toast.promise(supportPromise, {
      loading: "Sending support ticket...",
      success: (data: any) => {
        form.reset();
        return data.message;
      },
      error: (error: any) => {
        return error;
      },
    });
  }
  return (
    <div className="w-full min-h-[93vh] flex justify-center items-center my-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Support</CardTitle>
          <CardDescription>
            Please take a moment to get in touch, we will get back to you
            shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        rows={8}
                        placeholder="Message"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SupportPage;
