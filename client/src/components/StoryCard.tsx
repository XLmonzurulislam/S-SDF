import { Plus } from "lucide-react";

interface StoryCardProps {
  type: "create" | "view";
  user: {
    id: number;
    name: string;
    profilePicture: string;
  };
  storyImage?: string;
}

export default function StoryCard({ type, user, storyImage }: StoryCardProps) {
  if (type === "create") {
    return (
      <div className="flex-shrink-0 w-28 h-48 rounded-lg relative overflow-hidden border border-gray-200 group cursor-pointer">
        <img
          src={user.profilePicture}
          alt="Your Story"
          className="w-full h-3/4 object-cover"
        />
        <div className="absolute bottom-0 w-full h-1/4 bg-white flex items-center justify-center">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary w-8 h-8 rounded-full flex items-center justify-center text-white">
            <Plus className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium mt-3">Create Story</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 w-28 h-48 rounded-lg relative overflow-hidden group cursor-pointer">
      <img
        src={storyImage}
        alt={`${user.name}'s Story`}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 left-2 w-9 h-9 rounded-full border-4 border-primary overflow-hidden">
        <img
          src={user.profilePicture}
          alt={`${user.name}'s profile`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-2 left-2 right-2">
        <span className="text-white text-xs font-medium shadow-sm">{user.name}</span>
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition duration-200"></div>
    </div>
  );
}
