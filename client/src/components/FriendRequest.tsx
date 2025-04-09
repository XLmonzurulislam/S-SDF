import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface FriendRequestProps {
  request: {
    id: number;
    senderId: number;
    receiverId: number;
    sender: {
      id: number;
      name: string;
      profilePicture?: string;
    };
  };
  onAccept: () => void;
  onDelete: () => void;
}

export default function FriendRequest({ request, onAccept, onDelete }: FriendRequestProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-3">
        <Link href={`/profile/${request.sender.id}`}>
          <a>
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={
                  request.sender.profilePicture ||
                  `https://api.dicebear.com/6.x/initials/svg?seed=${request.sender.name}&backgroundColor=1877F2`
                }
                alt={`${request.sender.name}'s profile picture`}
              />
              <AvatarFallback>{request.sender.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </a>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/profile/${request.sender.id}`}>
            <a className="font-medium truncate hover:underline">{request.sender.name}</a>
          </Link>
          <p className="text-xs text-gray-500">3 mutual friends</p>
        </div>
      </div>
      <div className="flex space-x-2 mt-2">
        <Button 
          className="flex-1 bg-primary hover:bg-blue-600" 
          onClick={onAccept}
        >
          Confirm
        </Button>
        <Button 
          variant="secondary" 
          className="flex-1" 
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
