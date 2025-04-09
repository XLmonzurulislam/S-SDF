import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { 
  User, 
  UserPlus, 
  Bookmark, 
  Users as UsersIcon, 
  Calendar, 
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface FriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: string;
  createdAt: string;
  sender: {
    id: number;
    name: string;
    profilePicture?: string;
  };
}

export default function LeftSidebar() {
  const { user } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const { data: friendRequests } = useQuery<FriendRequest[]>({
    queryKey: ["/api/friend-requests"],
    enabled: !!user,
  });

  if (!user) return null;

  const pendingRequestsCount = friendRequests?.length || 0;

  return (
    <aside className="hidden md:block w-1/4 space-y-4">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 font-medium">Menu</div>
        <div className="space-y-1 px-2 pb-3">
          <Link href={`/profile/${user.id}`}>
            <a className="flex items-center p-2 rounded-lg hover:bg-gray-100">
              <div className="bg-primary text-white p-2 rounded-full mr-3">
                <User className="h-4 w-4" />
              </div>
              <span>Profile</span>
            </a>
          </Link>
          <Link href="/friends">
            <a className="flex items-center p-2 rounded-lg hover:bg-gray-100">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <UserPlus className="h-4 w-4" />
              </div>
              <span>Friends</span>
              {pendingRequestsCount > 0 && (
                <Badge variant="destructive" className="ml-auto">{pendingRequestsCount}</Badge>
              )}
            </a>
          </Link>
          <Link href="/saved">
            <a className="flex items-center p-2 rounded-lg hover:bg-gray-100">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <Bookmark className="h-4 w-4" />
              </div>
              <span>Saved</span>
            </a>
          </Link>
          <Link href="/groups">
            <a className="flex items-center p-2 rounded-lg hover:bg-gray-100">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <UsersIcon className="h-4 w-4" />
              </div>
              <span>Groups</span>
            </a>
          </Link>
          <Link href="/events">
            <a className="flex items-center p-2 rounded-lg hover:bg-gray-100">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <Calendar className="h-4 w-4" />
              </div>
              <span>Events</span>
            </a>
          </Link>
          <Button 
            variant="ghost" 
            className="flex items-center w-full justify-start p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
          >
            <div className="bg-gray-100 p-2 rounded-full mr-3 text-center">
              <ChevronDown className="h-4 w-4" />
            </div>
            <span>See {showMoreMenu ? "less" : "more"}</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 font-medium flex justify-between items-center">
          <span>Your shortcuts</span>
          <Button variant="link" size="sm" className="text-primary h-auto p-0">Edit</Button>
        </div>
        <div className="space-y-1 px-2 pb-3">
          <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
            <div className="w-10 h-10 rounded-lg bg-gray-200 mr-3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1603366445787-09714680cbf1?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                alt="Group Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <span>Photography Club</span>
          </a>
          <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
            <div className="w-10 h-10 rounded-lg bg-gray-200 mr-3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1601979031925-424e53b6caaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                alt="Group Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <span>Tech Enthusiasts</span>
          </a>
          <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
            <div className="w-10 h-10 rounded-lg bg-gray-200 mr-3 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
                alt="Group Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <span>Hiking Adventures</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
