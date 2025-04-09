import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PostWithUser } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Globe 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

interface PostCardProps {
  post: PostWithUser;
  currentUserId: number;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [showAllComments, setShowAllComments] = useState(false);
  const { toast } = useToast();
  
  const isLiked = post.likes.some(like => like.userId === currentUserId);
  
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        return apiRequest("DELETE", `/api/posts/${post.id}/like`, null);
      } else {
        return apiRequest("POST", `/api/posts/${post.id}/like`, null);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${post.user.id}/posts`] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error processing your like. Please try again.",
      });
    },
  });
  
  const handleLike = () => {
    likeMutation.mutate();
  };
  
  // Format the date
  const formattedDate = post.createdAt 
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) 
    : "";
  
  // Limit comments to 2 unless showAllComments is true
  const commentsToShow = showAllComments 
    ? post.comments 
    : post.comments.slice(0, 2);
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href={`/profile/${post.user.id}`}>
              <a className="block">
                <Avatar>
                  <AvatarImage 
                    src={post.user.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${post.user.name}&backgroundColor=1877F2`} 
                    alt={post.user.name} 
                  />
                  <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </a>
            </Link>
            <div>
              <Link href={`/profile/${post.user.id}`}>
                <a className="font-medium hover:underline">{post.user.name}</a>
              </Link>
              <div className="text-xs text-gray-500 flex items-center">
                <span>{formattedDate}</span>
                <span className="mx-1">•</span>
                <Globe className="h-3 w-3" />
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mt-3">
          <p className="text-gray-800">{post.content}</p>
        </div>
      </div>
      
      {post.imageUrl && (
        <div className="w-full">
          <img 
            src={post.imageUrl} 
            alt="Post attachment" 
            className="w-full"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between text-gray-500 text-sm mb-2">
          <div className="flex items-center">
            {post._count.likes > 0 && (
              <div className="flex items-center">
                <div className="flex -space-x-1 mr-2">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white">
                    <ThumbsUp className="h-3 w-3" />
                  </div>
                </div>
                <span>{post._count.likes}</span>
              </div>
            )}
          </div>
          {(post._count.comments > 0 || post._count.likes > 0) && (
            <div className="flex space-x-3">
              {post._count.comments > 0 && (
                <Button variant="ghost" className="h-auto p-0 text-gray-500 hover:text-gray-700" onClick={() => setShowAllComments(!showAllComments)}>
                  {post._count.comments} comment{post._count.comments !== 1 ? 's' : ''}
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="border-t border-b border-gray-200 py-1">
          <div className="flex justify-between">
            <Button
              variant="ghost"
              className={`flex items-center justify-center py-2 flex-1 hover:bg-gray-100 rounded-lg ${isLiked ? 'text-primary' : 'text-gray-600'}`}
              onClick={handleLike}
              disabled={likeMutation.isPending}
            >
              <ThumbsUp className="h-5 w-5 mr-2" />
              <span className="font-medium text-sm">Like</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center justify-center py-2 flex-1 hover:bg-gray-100 rounded-lg text-gray-600"
              onClick={() => setShowAllComments(true)}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              <span className="font-medium text-sm">Comment</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center justify-center py-2 flex-1 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <Share2 className="h-5 w-5 mr-2" />
              <span className="font-medium text-sm">Share</span>
            </Button>
          </div>
        </div>
        
        {/* Comments */}
        {post._count.comments > 0 && (
          <div className="mt-2 space-y-2">
            {commentsToShow.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
            
            {post.comments.length > 2 && !showAllComments && (
              <Button
                variant="ghost"
                className="text-sm text-gray-500 hover:text-gray-700 mt-1 p-0 h-auto"
                onClick={() => setShowAllComments(true)}
              >
                View all {post._count.comments} comments
              </Button>
            )}
          </div>
        )}
        
        <CommentForm postId={post.id} />
      </div>
    </div>
  );
}
