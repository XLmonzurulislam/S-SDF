import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, MoreHorizontal, Gift } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import FriendRequest from "./FriendRequest";
import ContactCard from "./ContactCard";

interface FriendRequestType {
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

interface UserType {
  id: number;
  username: string;
  name: string;
  profilePicture?: string;
}

export default function RightSidebar() {
  const { user } = useAuth();

  const { data: friendRequests, isLoading: requestsLoading } = useQuery<FriendRequestType[]>({
    queryKey: ["/api/friend-requests"],
    enabled: !!user,
  });

  const { data: friends, isLoading: friendsLoading } = useQuery<UserType[]>({
    queryKey: ["/api/friends"],
    enabled: !!user,
  });

  const acceptRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      return apiRequest("PUT", `/api/friend-requests/${requestId}`, { status: "accepted" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/friend-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: async (requestId: number) => {
      return apiRequest("PUT", `/api/friend-requests/${requestId}`, { status: "rejected" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/friend-requests"] });
    },
  });

  const handleAcceptRequest = (requestId: number) => {
    acceptRequestMutation.mutate(requestId);
  };

  const handleDeleteRequest = (requestId: number) => {
    deleteRequestMutation.mutate(requestId);
  };

  if (!user) return null;

  return (
    <aside className="hidden md:block w-1/4 space-y-4">
      {/* Friend Requests */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Friend Requests</h3>
          <Link href="/friends">
            <a className="text-primary text-sm">See all</a>
          </Link>
        </div>
        {requestsLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : friendRequests && friendRequests.length > 0 ? (
          <div className="space-y-4">
            {friendRequests.map((request) => (
              <FriendRequest
                key={request.id}
                request={request}
                onAccept={() => handleAcceptRequest(request.id)}
                onDelete={() => handleDeleteRequest(request.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No pending friend requests
          </div>
        )}
      </div>

      {/* Birthdays */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Birthdays</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Gift className="text-primary h-5 w-5" />
          <p className="text-sm">
            <span className="font-medium">Michael Chen</span> and{" "}
            <span className="font-medium">2 others</span> have birthdays today.
          </p>
        </div>
      </div>

      {/* Contacts */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Contacts</h3>
          <div className="flex space-x-2 text-gray-500">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {friendsLoading ? (
          <div className="space-y-2 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-2">
                <div className="h-9 w-9 rounded-full bg-gray-200"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : friends && friends.length > 0 ? (
          <div className="space-y-2">
            {friends.map((friend) => (
              <ContactCard
                key={friend.id}
                user={friend}
                status="online"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No contacts yet. Add friends to see them here.
          </div>
        )}
      </div>
    </aside>
  );
}
