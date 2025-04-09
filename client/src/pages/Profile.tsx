import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation, useParams } from "wouter";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import PostCard from "@/components/PostCard";
import { PostWithUser, UserWithFriendship } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const profileId = parseInt(params.id);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [user, authLoading, setLocation]);

  const { data: profileUser, isLoading: profileLoading } = useQuery<UserWithFriendship>({
    queryKey: [`/api/users/${profileId}`],
    enabled: !!user && !isNaN(profileId),
  });

  const { data: posts, isLoading: postsLoading } = useQuery<PostWithUser[]>({
    queryKey: [`/api/users/${profileId}/posts`],
    enabled: !!user && !isNaN(profileId),
  });

  const handleFriendRequest = async () => {
    if (!profileUser) return;

    try {
      if (profileUser.friendStatus === "none" || profileUser.friendStatus === "pending_received") {
        await apiRequest("POST", "/api/friend-requests", {
          receiverId: profileId,
        });
        toast({
          title: "Request Sent",
          description: `Friend request sent to ${profileUser.name}`,
        });
      } else if (profileUser.friendStatus === "pending_sent") {
        // Find the pending request
        const { data: requests } = await apiRequest("GET", "/api/friend-requests", null);
        const request = requests.find((r: any) => r.senderId === profileId);
        
        if (request) {
          await apiRequest("PUT", `/api/friend-requests/${request.id}`, {
            status: "accepted",
          });
          toast({
            title: "Request Accepted",
            description: `You are now friends with ${profileUser.name}`,
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not process friend request",
      });
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <h2 className="text-lg font-medium text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user || !profileUser) return null;

  const isOwnProfile = user.id === profileUser.id;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
          {/* Cover Photo */}
          <div className="h-64 bg-gradient-to-r from-blue-400 to-blue-600 relative">
            {profileUser.coverPicture && (
              <img
                src={profileUser.coverPicture}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-4 md:left-8">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                <img
                  src={profileUser.profilePicture || `https://api.dicebear.com/6.x/initials/svg?seed=${profileUser.name}&backgroundColor=1877F2`}
                  alt={profileUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Actions */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {isOwnProfile ? (
                <Button>Edit Profile</Button>
              ) : (
                <>
                  {profileUser.friendStatus === "friends" ? (
                    <Button variant="outline">
                      <span className="flex items-center">
                        <span className="mr-2 text-green-500">✓</span> Friends
                      </span>
                    </Button>
                  ) : profileUser.friendStatus === "pending_sent" ? (
                    <Button variant="outline" onClick={handleFriendRequest}>
                      Accept Request
                    </Button>
                  ) : profileUser.friendStatus === "pending_received" ? (
                    <Button variant="outline" disabled>
                      Request Sent
                    </Button>
                  ) : (
                    <Button onClick={handleFriendRequest}>Add Friend</Button>
                  )}
                  <Button variant="outline">Message</Button>
                </>
              )}
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="mt-16 px-4 pb-4">
            <h1 className="text-2xl font-bold">{profileUser.name}</h1>
            <p className="text-gray-500">{profileUser.bio || "No bio yet"}</p>
          </div>
          
          {/* Profile Navigation */}
          <div className="border-t border-gray-200 px-4">
            <div className="flex overflow-x-auto">
              <button className="px-4 py-3 font-medium text-primary border-b-2 border-primary">
                Posts
              </button>
              <button className="px-4 py-3 font-medium text-gray-500 hover:bg-gray-100">
                About
              </button>
              <button className="px-4 py-3 font-medium text-gray-500 hover:bg-gray-100">
                Friends
              </button>
              <button className="px-4 py-3 font-medium text-gray-500 hover:bg-gray-100">
                Photos
              </button>
            </div>
          </div>
        </div>

        <div className="md:flex md:space-x-4">
          {/* Left Sidebar */}
          <div className="hidden md:block md:w-1/4">
            <LeftSidebar />
          </div>

          {/* Profile Content */}
          <div className="md:w-3/4 space-y-4">
            {/* Posts */}
            {postsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="mt-4 h-24 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} currentUserId={user.id} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-lg font-medium text-gray-700">No posts yet</h3>
                {isOwnProfile ? (
                  <p className="text-gray-500 mt-2">
                    Share your thoughts with the world by creating your first post!
                  </p>
                ) : (
                  <p className="text-gray-500 mt-2">
                    {profileUser.name} hasn't posted anything yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
