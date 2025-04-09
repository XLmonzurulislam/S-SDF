import { formatDistanceToNow } from "date-fns";
import { CommentWithUser } from "@shared/schema";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CommentProps {
  comment: CommentWithUser;
}

export default function Comment({ comment }: CommentProps) {
  // Format the date
  const formattedDate = comment.createdAt 
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) 
    : "";

  return (
    <div className="flex items-start space-x-2">
      <Link href={`/profile/${comment.user.id}`}>
        <a>
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage
              src={
                comment.user.profilePicture ||
                `https://api.dicebear.com/6.x/initials/svg?seed=${comment.user.name}&backgroundColor=1877F2`
              }
              alt={comment.user.name}
            />
            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </a>
      </Link>
      <div className="bg-gray-100 rounded-2xl px-3 py-2 flex-1">
        <div className="flex items-center justify-between">
          <Link href={`/profile/${comment.user.id}`}>
            <a className="font-medium text-sm hover:underline">{comment.user.name}</a>
          </Link>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        <p className="text-sm mt-1">{comment.content}</p>
      </div>
    </div>
  );
}
