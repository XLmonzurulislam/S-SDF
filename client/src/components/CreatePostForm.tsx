import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Video, Image, Smile, Globe, ChevronDown } from "lucide-react";

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Post content cannot be empty.",
  }),
  imageUrl: z.string().optional(),
});

export default function CreatePostForm() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      imageUrl: "",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return apiRequest("POST", "/api/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
      form.reset();
      setOpen(false);
      toast({
        title: "Post created",
        description: "Your post has been published successfully!",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error creating your post. Please try again.",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createPostMutation.mutate(values);
  }

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage
            src={
              user.profilePicture ||
              `https://api.dicebear.com/6.x/initials/svg?seed=${user.name}&backgroundColor=1877F2`
            }
            alt={user.name}
          />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200 rounded-full py-2 px-4 flex-1 text-left text-gray-500 justify-start"
            >
              What's on your mind, {user.name.split(" ")[0]}?
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="text-center">Create Post</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2 mb-4">
              <Avatar>
                <AvatarImage
                  src={
                    user.profilePicture ||
                    `https://api.dicebear.com/6.x/initials/svg?seed=${user.name}&backgroundColor=1877F2`
                  }
                  alt={user.name}
                />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <Button variant="outline" size="sm" className="flex items-center h-7 px-2 text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  <span>Public</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={`What's on your mind, ${user.name.split(" ")[0]}?`}
                          className="min-h-[150px] border-none text-lg focus-visible:ring-0 resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="border rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Add to your post</span>
                            <div className="flex space-x-2">
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 rounded-full text-green-500"
                                onClick={() => {
                                  field.onChange(prompt("Enter image URL:") || "");
                                }}
                              >
                                <Image className="h-5 w-5" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 rounded-full text-blue-500"
                              >
                                <Video className="h-5 w-5" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9 rounded-full text-yellow-500"
                              >
                                <Smile className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                          {field.value && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-500 truncate">
                                Image URL: {field.value}
                              </p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={createPostMutation.isPending}
                >
                  {createPostMutation.isPending ? "Posting..." : "Post"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border-t border-gray-200 mt-3 pt-3">
        <div className="flex justify-between">
          <Button
            onClick={() => setOpen(true)}
            variant="ghost"
            className="flex-1 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <Video className="h-5 w-5 mr-2 text-red-500" />
            <span className="font-medium text-sm">Live</span>
          </Button>
          <Button
            onClick={() => setOpen(true)}
            variant="ghost"
            className="flex-1 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <Image className="h-5 w-5 mr-2 text-green-500" />
            <span className="font-medium text-sm">Photos</span>
          </Button>
          <Button
            onClick={() => setOpen(true)}
            variant="ghost"
            className="flex-1 hover:bg-gray-100 rounded-lg text-gray-600"
          >
            <Smile className="h-5 w-5 mr-2 text-yellow-500" />
            <span className="font-medium text-sm">Feeling</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
