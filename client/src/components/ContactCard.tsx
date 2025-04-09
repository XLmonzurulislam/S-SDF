import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ContactCardProps {
  user: {
    id: number;
    name: string;
    profilePicture?: string;
  };
  status: "online" | "offline";
}

export default function ContactCard({ user, status }: ContactCardProps) {
  return (
    <Link href={`/profile/${user.id}`}>
      <a className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
        <div className="relative">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={
                user.profilePicture ||
                `https://api.dicebear.com/6.x/initials/svg?seed=${user.name}&backgroundColor=1877F2`
              }
              alt={user.name}
            />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div 
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              status === "online" ? "bg-green-500" : "bg-gray-500"
            }`}
          ></div>
        </div>
        <span className="font-medium text-sm">{user.name}</span>
      </a>
    </Link>
  );
}
