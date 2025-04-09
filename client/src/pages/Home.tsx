import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import CreatePostForm from "@/components/CreatePostForm";
import PostCard from "@/components/PostCard";
import StoryCard from "@/components/StoryCard";
import { PostWithUser } from "@shared/schema";

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [user, authLoading, setLocation]);

  const { data: posts, isLoading: postsLoading } = useQuery<PostWithUser[]>({
    queryKey: ["/api/posts/feed"],
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <h2 className="text-lg font-medium text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-4 md:flex md:space-x-4">
        {/* Left Sidebar - Hidden on mobile */}
        <LeftSidebar />

        {/* Main Content */}
        <div className="md:w-2/4 space-y-4">
          {/* Stories */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
              {/* Create Story */}
              <StoryCard
                type="create"
                user={{
                  id: user.id,
                  name: user.name,
                  profilePicture: user.profilePicture || "",
                }}
              />

              {/* Other stories would go here in a real app */}
              <StoryCard
                type="view"
                user={{
                  id: 2,
                  name: "Sarah Johnson",
                  profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
                }}
                storyImage="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
              />

              <StoryCard
                type="view"
                user={{
                  id: 3,
                  name: "Michael Chen",
                  profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
                }}
                storyImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
              />

              <StoryCard
                type="view"
                user={{
                  id: 4,
                  name: "Sophia Lee",
                  profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
                }}
                storyImage="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
              />

              <StoryCard
                type="view"
                user={{
                  id: 5,
                  name: "James Wilson",
                  profilePicture: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
                }}
                storyImage="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
              />
            </div>
          </div>

          {/* Create Post */}
          <CreatePostForm />

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
              <p className="text-gray-500 mt-2">
                Start by creating a post or connecting with friends!
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Hidden on mobile */}
        <RightSidebar />
      </main>
    </div>
  );
}
