import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RichTextEditor from "@/components/TextEditor";
import { fetchCreatePost, resetCreatePost } from "@/features/PostSlice";
import { useEffect } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(2, {
    message: "content must be at least 2 characters.",
  }),
  thumbnail: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Thumbnail is required.",
    })
    .refine((file) => file?.size <= 3 * 1024 * 1024, {
      message: "Thumbnail size must be less than 3MB.",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file?.type),
      {
        message: "Only .jpg, .png, and .gif formats are supported.",
      }
    ),
  isPublic: z.boolean(),
});

function CreatePostPage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const userDetails = useSelector((state: any) => state.user.userDetails);
  const userDetailsData = userDetails.data || {};
  const createPost = useSelector((state: any) => state.post.createPost);
  const createPostStatus = useSelector(
    (state: any) => state.post.createPostStatus
  );
  const createPostError = useSelector(
    (state: any) => state.post.createPostError
  );

  useEffect(() => {
    if (!userDetailsData.isVerified) {
      navigate(`/profile/${userDetailsData._id}`);
      toast.warning("Please verify your account first");
    }
  }, [dispatch]);

  useEffect(() => {
    if (createPostStatus === "succeeded") {
      const id = createPost.data._id;
      navigate(`/post/${id}`);
      dispatch(resetCreatePost());
    } else if (createPostStatus === "failed") {
      toast.error(createPostError);
      dispatch(resetCreatePost());
    }
  }, [createPostStatus]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      thumbnail: undefined,
      isPublic: true,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const postPromise = dispatch(fetchCreatePost(data)).unwrap();
    toast.promise(postPromise, {
      loading: "Posting...",
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
      <div className="w-[90%] mx-auto bg-accent p-4 rounded-lg my-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background"
                      placeholder="Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <RichTextEditor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background"
                      type="file"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      className="my-auto"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel>Public Post</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}

export default CreatePostPage;
