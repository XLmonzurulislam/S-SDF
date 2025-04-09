import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Comment cannot be empty.",
  }),
});

interface CommentFormProps {
  postId: number;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return apiRequest("POST", `/api/posts/${postId}/comments`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
      form.reset();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error posting your comment. Please try again.",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    commentMutation.mutate(values);
  }

  if (!user) return null;

  return (
    <div className="flex items-start space-x-2 mt-3">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage
          src={
            user.profilePicture ||
            `https://api.dicebear.com/6.x/initials/svg?seed=${user.name}&backgroundColor=1877F2`
          }
          alt={user.name}
        />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex-1">
                    <Input
                      placeholder="Write a comment..."
                      className="w-full bg-gray-100 rounded-full pr-12"
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && field.value.trim()) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                    />
                    {commentMutation.isPending && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
